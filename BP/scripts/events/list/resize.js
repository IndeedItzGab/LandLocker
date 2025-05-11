import { world, system } from "@minecraft/server"
import * as db from "../../utilities/storage.js" 
import { messages } from "../../messages.js"
import "../../utilities/checkLand.js"
import "../../utilities/claimBlocks.js"
import "../../utilities/getTopBlock.js"
import "../../utilities/visualization.js"
import "../../utilities/overlapCheck.js"

world.beforeEvents.playerBreakBlock.subscribe((e) => {
  resize(e)
})

world.beforeEvents.playerInteractWithBlock.subscribe((e) => {
  resize(e)
})

function resize(event) {
  const player = event.player
  const block = event.block
  const isAdmin = player.isOp() // CODE_ORANGE
  const editData = player.getTags().find(v => v.startsWith("editingLand:"))
  const usedItem = player?.getComponent("inventory")?.container?.getItem(player?.selectedSlotIndex)
  if(usedItem?.typeId !== "minecraft:golden_shovel") return;
  
  let lands = db.fetch("land", true)
  
  lands.filter(data => {
    const isOwner = data.owner?.toLowerCase() === player.name.toLowerCase();

if (!isOwner && (!data.owner || (!data.owner && !isAdmin))) {
  return true; // deny access
}
    
    // Replace the old land size
    if(data?.id === editData?.split(':')[1]) {
      event.cancel = true
      if(data.bounds.rx <= block.location.x && editData.split(':')[2] === "true") {
        data.bounds.lx = data.bounds.rx;
        data.bounds.rx = block.location.x;
      } else if(data.bounds.lx >= block.location.x && editData.split(':')[2] === "false") {
        data.bounds.rx = data.bounds.lx;
        data.bounds.lx = block.location.x;
      } else if(editData.split(':')[2] === "true") {
        data.bounds.lx = block.location.x;
      } else if(editData.split(':')[2] === "false") {
        data.bounds.rx = block.location.x
      }
  
      if(data.bounds.rz <= block.location.z && editData.split(':')[3] === "true") {
        data.bounds.lz = data.bounds.rz;
        data.bounds.rz = block.location.z;
      } else if(data.bounds.lz >= block.location.z && editData.split(':')[3] === "false") {
        data.bounds.rz = data.bounds.lz;
        data.bounds.lz = block.location.z;
      } else if(editData.split(':')[3] === "true") {
        data.bounds.lz = block.location.z;
      } else if(editData.split(':')[3] === "false") {
        data.bounds.rz = block.location.z
      }
      
      system.run(() => {
        player.removeTag(editData);
      })
      
      // Check if the player have enough claim blocks.
      const permutationClaimBlocks = claimBlocks(player, data.id) - (Math.abs(data.bounds.rx - data.bounds.lx) + 1) * (Math.abs(data.bounds.rz - data.bounds.lz) + 1)
      if(permutationClaimBlocks < 0 && data.owner) return player.sendMessage(`§c${messages.ResizeNeedMoreBlocks.replace("{0}", Math.abs(permutationClaimBlocks))}`)
      
      // If it overlaps with other claim then it stop updating the land size.
      const overlap = overlapCheck(player, data.bounds.lx, data.bounds.rx, data.bounds.lz, data.bounds.rz, data.id)
      if(overlap && overlap?.id !== data.id) return player.sendMessage(`§c${messages.ResizeFailOverlap}`) // Self-made message
      
      const secondaryBlock = !data.owner ? "landlocker:admin_secondary_block" : "landlocker:basic_secondary_block"
      const corners = visualization("landlocker:basic_primary_block", secondaryBlock, data)
      const blocks = db.fetch(`landCacheBlocks:${!data.owner ? "admin" : player.name.toLowerCase()}`, true) || []
      let updateCacheBlocksData = []
      
      // Remove the old outline
      for(const cacheBlock of blocks) {
        const block = player.dimension.getBlock({x: cacheBlock.location.x, y: cacheBlock.location.y, z: cacheBlock.location.z})
        const specifiedCornerData = corners.find(pos => pos.x === cacheBlock.location.x && pos.y === cacheBlock.location.y && pos.z === cacheBlock.location.z)
        const specifiedBlock = specifiedCornerData
          ? specifiedCornerData.type !== cacheBlock.temporaryBlock ? specifiedCornerData.type : cacheBlock.temporaryBlock
          : cacheBlock.originalBlock;
          
        system.run(() => {
         block.setType(specifiedBlock)
        })
        
        if(!specifiedCornerData) continue
        updateCacheBlocksData.push(cacheBlock)
      }
      
      // Update cache blocks that shows when you hold golden shovel.
      for(const pos of corners) {
        const block = player.dimension.getBlock({x: pos.x, y: pos.y, z: pos.z})
        //if(block?.typeId.includes("landlocker:")) continue
        //if(playerCacheBlocks.some(d => d.location.x === pos.x && d.location.y === pos.y && d.location.z === pos.z)) continue;
        const shovelCacheBlock = db.fetch("shovelClaimCacheBlock", true)?.find(b => b.location.x === pos.x && b.location.y === pos.y && b.location.z === pos.z)?.originalBlock
        const currentOriginalBlock = updateCacheBlocksData.find(b => b.location.x === pos.x && b.location.y === pos.y && b.location.z === pos.z)?.originalBlock || shovelCacheBlock?.originalBlock ||block?.typeId
        updateCacheBlocksData.push({
          owner: player.name.toLowerCase(),
          landId: data.id,
          originalBlock: currentOriginalBlock,
          temporaryBlock: pos.type,
          location: { x: pos.x, y: pos.y, z: pos.z}
        })
        system.run(() => {
          block?.setType(pos.type)
        })
      }
      db.store(`landCacheBlocks:${!data.owner ? "admin" : player.name.toLowerCase()}`, updateCacheBlocksData)
      db.store("land", lands)
      player.sendMessage(`§e${messages.ClaimResizeSuccess.replace("{0}", !data.owner ? 0 : claimBlocks(player))}`)
      return true; // Return to make it won't declare another side to be adjusted.
    }
    
    // Declare which side will get adjusted
    const x = block?.location.x === data.bounds.lx ? true : block?.location.x === data.bounds.rx ? false : null;
    const z = block?.location.z === data.bounds.lz ? true : block?.location.z === data.bounds.rz ? false : null;
    if(x === null || z === null) return true;
    event.cancel = true;
    system.run(() => {
      player.addTag(`editingLand:${data.id}:${x}:${z}`);
    })
    player.sendMessage(`§e${messages.ResizeStart}`);
    return true
  })
}