import { world, system } from "@minecraft/server"
import * as db from "../../utilities/storage.js" 
import { messages } from "../../messages.js"
import { config } from "../../config.js"
import "../../utilities/overlapCheck.js"
import "../../utilities/getTopBlock.js"
import "../../utilities/claimBlocks.js"
import "../../utilities/checkLand.js"

// The other function related to claiming land with shovel would be in show.js file.
world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
  const player = event.player
  const block = event.block
  const claimTag = player.getTags().find(d => d.includes("shovelClaim:"))
  const editData = player.getTags().find(v => v.startsWith("editingLand:"))
  if(editData) return;

  let lands = db.fetch("land", true)
  const usedItem = player?.getComponent("inventory")?.container?.getItem(player?.selectedSlotIndex)
  if(usedItem?.typeId !== config.LandLocker.Claims.ModificationTool) return;
  
  if(lands.some(d => (
    (d.bounds.lx === block.location.x && d.bounds.lz === block.location.z) ||
    (d.bounds.lx === block.location.x && d.bounds.rz === block.location.z) ||
    (d.bounds.rx === block.location.x && d.bounds.rz === block.location.z) ||
    (d.bounds.rx === block.location.x && d.bounds.lz === block.location.z) 
  ))) return
  
  if(checkLand(block)) return player.sendMessage(`§c${messages.CreateClaimFailOverlap}`) // no message yet

  if(!claimTag) {
    system.run(() => {
      player.addTag(`shovelClaim:${block.location.x}:${block.location.z}`)
    })
    let cacheBlock = db.fetch("shovelClaimCacheBlock", true)
    cacheBlock.push({
      owner: player.name.toLowerCase(),
      world: player.dimension.id,
      originalBlock: block.typeId,
      temporaryBlock: "landlocker:set_block",
      location: {x: block.location.x, y: block.location.y, z: block.location.z}
    })
    system.run(() => {
      block.setType("landlocker:set_block")
    })
    db.store("shovelClaimCacheBlock", cacheBlock)
    player.sendMessage(`§e${messages.ClaimStart}`) // no message yet
    event.cancel = true
  } else {
    // Remove the tag
    system.run(() => {
      player.removeTag(claimTag)
    })
    
    let tagLX = parseInt(claimTag.split(':')[1])
    let tagLZ = parseInt(claimTag.split(':')[2])
    let tagRX = block.location.x
    let tagRZ = block.location.z
    
    if(tagLX >= block.location.x) {
      tagRX = tagLX
      tagLX = block.location.x
    }
    
    if(tagLZ >= block.location.z) {
      tagRZ = tagLZ
      tagLZ = block.location.z
    }
    
    const leftX = Math.round(tagLX);
    const rightX = Math.round(tagRX);
    const leftZ = Math.round(tagLZ);
    const rightZ = Math.round(tagRZ);
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
    
    if(permutationClaimBlocks < 0 && !isAdminMode) return player.sendMessage(`§c${messages.CreateClaimInsufficientBlocks.replace("{0}", Math.abs(permutationClaimBlocks))}`)
    if((((Math.abs(rightX - leftX) + 1) * (Math.abs(rightZ- leftZ) + 1)) < (config.LandLocker.Claims.MinSize*config.LandLocker.Claims.MinSize)) && !isAdminMode) return player.sendMessage(`§c${messages.ResizeClaimInsufficientArea.replace("{0}", config.LandLocker.Claims.MinSize*config.LandLocker.Claims.MinSize)}`)
    if((leftX + config.LandLocker.Claims.MinWide > rightX || leftZ + config.LandLocker.Claims.MinWide > rightZ) && !isAdminMode) return player.sendMessage(`§c${messages.NewClaimTooNarrow.replace("{0}", config.LandLocker.Claims.MinWide)}`)
    if(overlapCheck(player, leftX, rightX, leftZ, rightZ)) return player.sendMessage(`§c${messages.CreateClaimFailOverlapShort}`)
    

    const data = {
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
      members: []
    }
    
    lands.push(data)
    db.store("land", lands)
    player.sendMessage(`§a${messages.CreateClaimSuccess}`)
    event.cancel = true
  }
})