import { world, system } from "@minecraft/server"
import * as db from "../../utilities/storage.js" 
import "../../utilities/checkLand.js"
import "../../utilities/claimBlocks.js"
import "../../utilities/getTopBlock.js"
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
  const editData = player.getTags().find(v => v.startsWith("editingLand:"))
  const usedItem = player?.getComponent("inventory")?.container?.getItem(player?.selectedSlotIndex)
  if(usedItem?.typeId !== "minecraft:golden_shovel") return;
  
  let lands = db.fetch("land", true)|| []
  
  lands.filter(data => {
      // Replace the old land size
    if(data?.owner.toLowerCase() === player.name.toLowerCase() && data?.id === editData?.split(':')[1]) {
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
      if(permutationClaimBlocks < 0) return player.sendMessage(`§cYou don't have enough blocks for this size.  You need ${Math.abs(permutationClaimBlocks)} more.`)
      
      // If it overlaps with other claim then it stop updating the land size.
      const overlap = overlapCheck(player, data.bounds.lx, data.bounds.rx, data.bounds.lz, data.bounds.rz, data.id)
      if(overlap && overlap?.id !== data.id) return player.sendMessage(`§cThere is a land overlapping your land. The land edit was not saved.`) // Self-made message
      
      const corners = [
        { x: data.bounds.lx, z: data.bounds.rz, y: getTopBlock({x: data.bounds.lx, z: data.bounds.rz}), type: "glowstone" },
        { x: data.bounds.lx, z: data.bounds.rz - 1, y: getTopBlock({x: data.bounds.lx, z: data.bounds.rz - 1}), type: "gold_block" },
        { x: data.bounds.lx + 1, z: data.bounds.rz, y: getTopBlock({x: data.bounds.lx + 1, z: data.bounds.rz}), type: "gold_block" },
        { x: data.bounds.lx, z: data.bounds.lz, y: getTopBlock({x: data.bounds.lx, z: data.bounds.lz}), type: "glowstone" },
        { x: data.bounds.lx + 1, z: data.bounds.lz, y: getTopBlock({x: data.bounds.lx + 1, z: data.bounds.lz}), type: "gold_block" },
        { x: data.bounds.lx, z: data.bounds.lz + 1, y: getTopBlock({x: data.bounds.lx, z: data.bounds.lz + 1}), type: "gold_block" },
        { x: data.bounds.rx, z: data.bounds.rz, y: getTopBlock({x: data.bounds.rx, z: data.bounds.rz}), type: "glowstone" },
        { x: data.bounds.rx, z: data.bounds.rz - 1, y: getTopBlock({x: data.bounds.rx, z: data.bounds.rz - 1}), type: "gold_block" },
        { x: data.bounds.rx - 1, z: data.bounds.rz, y: getTopBlock({x: data.bounds.rx - 1, z: data.bounds.rz}), type: "gold_block" },
        { x: data.bounds.rx, z: data.bounds.lz, y: getTopBlock({x: data.bounds.rx, z: data.bounds.lz}), type: "glowstone" },
        { x: data.bounds.rx - 1, z: data.bounds.lz, y: getTopBlock({x: data.bounds.rx - 1, z: data.bounds.lz}), type: "gold_block" },
        { x: data.bounds.rx, z: data.bounds.lz + 1, y: getTopBlock({x: data.bounds.rx, z: data.bounds.lz + 1}), type: "gold_block" },
      ];
      
      
      const blocks = db.fetch(`landCacheBlocks:${player.name.toLowerCase()}`, true) || []
      let updateCacheBlocksData = []
      for(const cacheBlock of blocks) {
        const block = player.dimension.getBlock({x: cacheBlock.location.x, y: cacheBlock.location.y, z: cacheBlock.location.z})
        if(corners.some(pos => pos.x === cacheBlock.location.x && pos.z === cacheBlock.location.z && pos.y === cacheBlock.location.y && pos.temporaryBlock === cacheBlock.temporaryBlock)) continue;
        system.run(() => {
          block?.setType(cacheBlock.originalBlock)
        })
        //updateCacheBlocksData = blocks.filter(data => data.location.x !== cacheBlock.location.x && data.location.y !== cacheBlock.location.y && data.location.z !== cacheBlock.location.z)
        updateCacheBlocksData.push(cacheBlock)
      }
      
      // Update cache blocks that shows when you hold golden shovel.
      for(const pos of corners) {
        const block = player.dimension.getBlock({x: pos.x, y: pos.y, z: pos.z})
        if(block?.typeId === "minecraft:gold_block" || block?.typeId === "minecraft:glowstone") continue;
        const currentOriginalBlock = updateCacheBlocksData.find(block => block.location.x === pos.x && block.location.z === pos.z && block.location.y === pos.y)?.originalBlock || block?.typeId
        updateCacheBlocksData.push({
          owner: player.name.toLowerCase(),
          landId: data.id,
          originalBlock: currentOriginalBlock,
          temporaryBlock: pos.type,
          location: { x: pos.x, y: pos.y, z: pos.z}
        })
        system.run(() => {
          block?.setType(`minecraft:${pos.type}`)
        })
      }
      db.store(`landCacheBlocks:${player.name.toLowerCase()}`, updateCacheBlocksData)
      db.store("land", lands)
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
    player.sendMessage(`§eResizing claim. Use your shovel again at the new location for this corner.`);
    return true
  })
}