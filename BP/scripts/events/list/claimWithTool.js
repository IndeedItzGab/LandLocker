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
  const isAdmin = player.isAdmin()
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
      let cacheBlock = db.fetch("shovelClaimCacheBlock", true)
      cacheBlock.push({
        owner: player.name.toLowerCase(),
        world: player.dimension.id,
        originalBlock: block.typeId,
        temporaryBlock: "landlocker:set_block",
        location: {x: block.location.x, y: block.location.y, z: block.location.z}
      })
      system.run(() => block.setType("landlocker:set_block"))
      db.store("shovelClaimCacheBlock", cacheBlock)
      player.sendMessage(`§e${messages.ClaimStart}`)
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
      player.sendMessage(`§a${messages.SubdivisionSuccess}`)
    } else {
      // Responsible for claiming a whole new claim land
      const permutationClaimBlocks = claimBlocks(player) - (Math.abs(rightX - leftX) + 1) * (Math.abs(rightZ- leftZ) + 1) 
      const isAdminMode = player.getTags().some(d => d === "shovelMode:adminClaims")
      let shovelCacheBlock = db.fetch("shovelClaimCacheBlock", true).find(d => d.owner === player.name.toLowerCase())
      const replaceBlock = world.getDimension(`${shovelCacheBlock?.world}`)?.getBlock({x: shovelCacheBlock.location.x, y: shovelCacheBlock.location.y, z: shovelCacheBlock.location.z})
      
      if(replaceBlock) {
        system.run(() => {
          replaceBlock.setType(shovelCacheBlock.originalBlock)
          shovelCacheBlock = db.fetch("shovelClaimCacheBlock", true).filter(d => !(d.location.x === shovelCacheBlock.location.x && d.location.y === shovelCacheBlock.location.y && d.location.z === shovelCacheBlock.location.z && d.owner === shovelCacheBlock.owner))
          db.store("shovelClaimCacheBlock", shovelCacheBlock)
        })
      }
      
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
        subdivisions: []
      })
      player.sendMessage(`§a${messages.CreateClaimSuccess}`)
    }
    
    db.store("land", lands)
    event.cancel = true
  }
})