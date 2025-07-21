import { world, system } from "@minecraft/server"
import * as db from "../../utilities/storage.js" 
import { messages } from "../../messages.js"
import { config } from "../../config.js"
import "../../utilities/overlapCheck.js"
import "../../utilities/getTopBlock.js"
import "../../utilities/claimBlocks.js"
import "../../utilities/checkLand.js"
import "../../utilities/checkSubLand.js"
import "../../utilities/overlapSubCheck.js"

// The other function related to claiming land with shovel would be in show.js file.
world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
  const player = event.player
  const block = event.block
  const isAdmin = player.playerPermissionLevel === 2
  // Early return to avoid further execution causing to decrease the performance of landlocker
  const usedItem = player?.getComponent("inventory")?.container?.getItem(player?.selectedSlotIndex)
  if(usedItem?.typeId !== config.LandLocker.Claims.ModificationTool) return;
  
  // Detect whether the player is resizing a subdivided claim.
  if(player.getTags().some(d => d.startsWith("isEditingSub:"))) return;
  
  let lands = db.fetch("land", true)
  if(checkLand(block)) {
    if(lands.some(land => {
      return land.subdivisions.some(d => {
        const x = block?.location.x === d.bounds.lx ? true : block?.location.x === d.bounds.rx ? false : null;
        const z = block?.location.z === d.bounds.lz ? true : block?.location.z === d.bounds.rz ? false : null;
        if(x === null || z === null) return
        return true
      })
    })) return
  }
  
  const claimTag = player.getTags().find(d => d.includes("shovelClaim:"))
  const editData = player.getTags().find(v => v.startsWith("editingLand:"))
  const isSubdivideClaim = player.hasTag("shovelMode:subdivisionClaims")
  if(editData) return;

  
  // Check whether it's claim's corner, then return to avoid further execution that conflicts with claim resizing.
  if(lands.some(d => (
    (d.bounds.lx === block.location.x && d.bounds.lz === block.location.z) ||
    (d.bounds.lx === block.location.x && d.bounds.rz === block.location.z) ||
    (d.bounds.rx === block.location.x && d.bounds.rz === block.location.z) ||
    (d.bounds.rx === block.location.x && d.bounds.lz === block.location.z) 
  ))) return
  
  // Check whether it's claiming inside a claimed area.
  if(checkLand(block) && !isSubdivideClaim) return player.sendMessage(`§c${messages.CreateClaimFailOverlap}`)
  if(checkSubLand(block) && isSubdivideClaim) return player.sendMessage(`§c${messages.CreateSubdivisionOverlap}`)
  if((!checkLand(block) || (!checkLand(block).owner && !isAdmin) || (checkLand(block).owner !== player.name.toLowerCase())) && isSubdivideClaim) return player.sendMessage(`§c${messages.DeleteClaimMissing}`) // Unsure message
  
  if(!claimTag) {
    system.run(() => player.addTag(`shovelClaim:${block.location.x}:${block.location.z}`))
    if(!isSubdivideClaim) {
      system.run(() => {
        const entity = world.getDimension(player.dimension.id).spawnEntity("landlocker:border", {x: block.location.x + 0.5, y: block.location.y, z: block.location.z + 0.5})
        entity?.addTag(`landlocker:${player.id}`)
        entity?.addTag(`landlocker:border:${JSON.stringify({red: 0, green: 1, blue: 1})}:primary`)
        entity?.addEffect("minecraft:slowness", 99999, {amplifier: 255, showParticles: false})
        entity?.addEffect("minecraft:invisibility", 99999, {amplifier: 255, showParticles: false})
        player.sendMessage(`§e${messages.ClaimStart}`)
      })
    } else {
      player.sendMessage(`§e${messages.SubdivisionStart}`)
    }
    event.cancel = true
  } else {
    // Remove the claim tag
    system.run(() => player.removeTag(claimTag))
    
    // Fetch all the corners' location and declare it as variables for further use.
    let tagLX = parseInt(claimTag.split(':')[1])
    let tagLZ = parseInt(claimTag.split(':')[2])
    let tagRX = block.location.x
    let tagRZ = block.location.z
    
    // These avoid twisted visualization
    if(tagLX >= block.location.x) {
      tagRX = tagLX
      tagLX = block.location.x
    }
    
    if(tagLZ >= block.location.z) {
      tagRZ = tagLZ
      tagLZ = block.location.z
    }
    
    // Redeclare updated data to a new variable
    const leftX = Math.round(tagLX);
    const rightX = Math.round(tagRX);
    const leftZ = Math.round(tagLZ);
    const rightZ = Math.round(tagRZ);

    if(isSubdivideClaim) {
      // Responsible for claiming a subdivided claim inside a claimed land.
      const land = lands.find(d => d.id=== checkLand(block).id)
      if(overlapSubCheck(player, leftX, rightX, leftZ, rightZ, land?.id, land.subdivisions.length)) return player.sendMessage(`§c${messages.ResizeFailOverlapSubdivision}`)

      land.subdivisions.push({
        setting: land.setting,
        bounds: {
          lx: leftX,
          lz: leftZ,
          rx: rightX,
          rz: rightZ,
        },
        publicPermissions: land.publicPermissions,
        members: land.members
      })

      const corners = visualization({red: 1, green: 1, blue: 1}, {red: 0.5, green: 0.5, blue: 0.5}, { bounds: { lx: leftX, lz: leftZ, rx: rightX, rz: rightZ } })

      for(const pos of corners) {
        system.run(() => {
          const entity = world.getDimension(player.dimension.id).spawnEntity("landlocker:border", {x: pos.x + 0.5, y: pos.y, z: pos.z + 0.5})
          entity?.addTag(`landlocker:${player.id}`)
          if(JSON.parse(pos.color).red === 1 && JSON.parse(pos.color).green === 1 && JSON.parse(pos.color).blue === 1) {
            entity?.addTag(`landlocker:border:${pos.color}:primary`)
          } else {
            entity?.addTag(`landlocker:border:${pos.color}`)
          }
          entity?.addEffect("minecraft:slowness", 99999, {amplifier: 255, showParticles: false})
          entity?.addEffect("minecraft:invisibility", 99999, {amplifier: 255, showParticles: false})
        })
      }
      player.sendMessage(`§a${messages.SubdivisionSuccess}`)
    } else {
      // Responsible for claiming a whole new claim land
      const permutationClaimBlocks = claimBlocks(player) - (Math.abs(rightX - leftX) + 1) * (Math.abs(rightZ- leftZ) + 1) 
      const isAdminMode = player.getTags().some(d => d === "shovelMode:adminClaims")

      // Remove the previous border entity
      system.run(() => {
        world.getDimension(player.dimension.id).getEntities().forEach(entity => {
          if(entity.getTags().some(tag => tag === `landlocker:border:${JSON.stringify({red: 0, green: 1, blue: 1})}:primary`)) {
            entity.remove()
          }
        })
      })
      
      // Some important filter stuff
      if(permutationClaimBlocks < 0 && !isAdminMode && !isSubdivideClaim) return player.sendMessage(`§c${messages.CreateClaimInsufficientBlocks.replace("{0}", Math.abs(permutationClaimBlocks))}`)
      if((((Math.abs(rightX - leftX) + 1) * (Math.abs(rightZ- leftZ) + 1)) < (config.LandLocker.Claims.MinSize*config.LandLocker.Claims.MinSize)) && !isAdminMode && !isSubdivideClaim) return player.sendMessage(`§c${messages.ResizeClaimInsufficientArea.replace("{0}", config.LandLocker.Claims.MinSize*config.LandLocker.Claims.MinSize)}`)
      if((leftX + config.LandLocker.Claims.MinWide > rightX || leftZ + config.LandLocker.Claims.MinWide > rightZ) && !isAdminMode && !isSubdivideClaim) return player.sendMessage(`§c${messages.NewClaimTooNarrow.replace("{0}", config.LandLocker.Claims.MinWide)}`)
      if(!isSubdivideClaim && overlapCheck(player, leftX, rightX, leftZ, rightZ)) return player.sendMessage(`§c${messages.CreateClaimFailOverlapShort}`)

      lands.push({
        owner: isAdminMode ? null : player.name.toLowerCase(),
        id: generateID(),
        world: player.dimension.id,
        bounds: {
          lx: leftX,
          lz: leftZ,
          rx: rightX,
          rz: rightZ
        },
        setting: {
          allowExplosions: false
        },
        publicPermissions: {
          fullTrust: false,
          accessTrust: false,
          containerTrust: false,
          permissionTrust: false
        },
        members: [],
        subdivisions: [],
        version: "1.0.7"
      })

      const secondaryBorder = isAdminMode ? {red: 1, green: 0.6, blue: 0} : {red: 1, green: 1, blue: 0}
      const corners = visualization({red: 1, green: 1, blue: 1}, secondaryBorder, { bounds: { lx: leftX, lz: leftZ, rx: rightX, rz: rightZ } })

      for(const pos of corners) {
        system.run(() => {
          const entity = world.getDimension(player.dimension.id).spawnEntity("landlocker:border", {x: pos.x + 0.5, y: pos.y, z: pos.z + 0.5})
          entity?.addTag(`landlocker:${player.id}`)
          if(JSON.parse(pos.color).red === 1 && JSON.parse(pos.color).green === 1 && JSON.parse(pos.color).blue === 1) {
            entity?.addTag(`landlocker:border:${pos.color}:primary`)
          } else {
            entity?.addTag(`landlocker:border:${pos.color}`)
          }
          entity?.addEffect("minecraft:slowness", 99999, {amplifier: 255, showParticles: false})
          entity?.addEffect("minecraft:invisibility", 99999, {amplifier: 255, showParticles: false})
        })
      }

      player.sendMessage(`§a${messages.CreateClaimSuccess}`)
    }
    
    db.store("land", lands)
    event.cancel = true
  }
})