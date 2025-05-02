import { world, system } from "@minecraft/server"
import * as db from "../../utilities/storage.js" 
import "../../utilities/getTopBlock.js"

system.runInterval(() => {
  [...world.getPlayers()].forEach(player => {
    const inv = player.getComponent("inventory").container
    const heldItem = inv.getItem(player.selectedSlotIndex)
    const land = (db.fetch("land", true) || []).filter(data => data.owner.toLowerCase() === player.name.toLowerCase())
    const dimension = player.dimension
    const allCacheBlocks = world.scoreboard.getObjectives().filter(data => data.id.includes("landCacheBlocks:"))
    
    for(const cache of allCacheBlocks) {
      const cachePlayer = [...world.getPlayers()].find(data => data.name.toLowerCase() === cache.id.replace("landCacheBlocks:", ''))
      const inv = cachePlayer?.getComponent("inventory")?.container
      const heldItem = inv?.getItem(cachePlayer?.selectedSlotIndex)
      if(heldItem?.typeId === "minecraft:golden_shovel") continue;

      let allPlayerCacheBlocks = db.fetch(cache.id, true)
      let blocksToBeRemoved = [];
      
      for(const cacheBlock of allPlayerCacheBlocks) {
        // Just remove the cache block if it's already undefine
        if(cacheBlock?.originalBlock === undefined) {
          blocksToBeRemoved.push(cacheBlock);
          continue;
        }
        const block = dimension.getBlock({x: cacheBlock.location.x, y: cacheBlock.location.y, z: cacheBlock.location.z})
        block?.setType(cacheBlock.originalBlock)
        if(block) blocksToBeRemoved.push(cacheBlock)
        //\\ if(block) playerCacheBlocks = playerCacheBlocks.filter(data => data.location.x !== cacheBlock.location.x && data.location.y !== cacheBlock.location.y && data.location.z !== cacheBlock.location.z)
      }
      allPlayerCacheBlocks = allPlayerCacheBlocks.filter(data => !blocksToBeRemoved.includes(data))
      db.store(cache.id, allPlayerCacheBlocks)
    }
    
    let playerCacheBlocks = db.fetch(`landCacheBlocks:${player.name.toLowerCase()}`, true) || []
    if(heldItem?.typeId === "minecraft:golden_shovel") {
      for(const data of land) {
        // Declaring all corners location
        // Might change to implement gold blocks at between.
        const corners = [
          { x: data.bounds.lx, z: data.bounds.rz, y: getTopBlock({x: data.bounds.lx, z: data.bounds.rz}), type: "glowstone"},
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
          { x: data.bounds.rx, z: data.bounds.lz + 1, y: getTopBlock({x: data.bounds.rx, z: data.bounds.lz + 1}), type: "gold_block" }
        ]
        
        // Handle replacing blocks at specified location
        for(const pos of corners) {
          const block = dimension.getBlock({x: pos.x, y: pos.y, z: pos.z})
          // Avoid making gold_block & glowstone into a original block as it will make it permanently implemented in the world.
          if(block?.typeId === "minecraft:gold_block" || block?.typeId === "minecraft:glowstone") continue;
          playerCacheBlocks.push({
            owner: player.name.toLowerCase(),
            landId: data.id,
            originalBlock: block?.typeId,
            temporaryBlock: pos.type,
            location: { x: pos.x, y: pos.y, z: pos.z}
          })
          block?.setType(`minecraft:${pos.type}`)
        }
        db.store(`landCacheBlocks:${player.name.toLowerCase()}`, playerCacheBlocks)
      }
    } else {
      const isEditing = player.hasTag("landEdit")
      const editData = player.getTags().find(v => v.startsWith("editingLand:"))
      if(isEditing) {
        system.run(() => {
          player.removeTag("landEdit")
          player.removeTag(editData)
        })
      };
    }
  })
}, 20)