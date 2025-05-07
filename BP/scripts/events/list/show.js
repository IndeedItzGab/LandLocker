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
    
    // Responsible for removing the edit blocks once the owner of the land no longer hold a golden shovel
    for(const cache of allCacheBlocks) {
      const cachePlayer = [...world.getPlayers()].find(data => data.name.toLowerCase() === cache.id.replace("landCacheBlocks:", ''))
      const inv = cachePlayer?.getComponent("inventory")?.container
      const heldItem = inv?.getItem(cachePlayer?.selectedSlotIndex)
      if(heldItem?.typeId === "minecraft:golden_shovel") continue;
      
      let allPlayerCacheBlocks = db.fetch(`${cache.id}`, true)
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
    
    let playerCacheBlocks = db.fetch(`landCacheBlocks:${player.name.toLowerCase()}`, true)
    if(heldItem?.typeId === "minecraft:golden_shovel") {
      for(const data of land) {
        // Declaring all corners location
        // const corners = [
//           { x: data.bounds.lx, z: data.bounds.rz, y: getTopBlock({x: data.bounds.lx, z: data.bounds.rz}), type: "glowstone"},
//           { x: data.bounds.lx, z: data.bounds.rz - 1, y: getTopBlock({x: data.bounds.lx, z: data.bounds.rz - 1}), type: "gold_block" },
//           { x: data.bounds.lx + 1, z: data.bounds.rz, y: getTopBlock({x: data.bounds.lx + 1, z: data.bounds.rz}), type: "gold_block" },
//   
//           { x: data.bounds.lx, z: data.bounds.lz, y: getTopBlock({x: data.bounds.lx, z: data.bounds.lz}), type: "glowstone" },
//           { x: data.bounds.lx + 1, z: data.bounds.lz, y: getTopBlock({x: data.bounds.lx + 1, z: data.bounds.lz}), type: "gold_block" },
//           { x: data.bounds.lx, z: data.bounds.lz + 1, y: getTopBlock({x: data.bounds.lx, z: data.bounds.lz + 1}), type: "gold_block" },
//   
//           { x: data.bounds.rx, z: data.bounds.rz, y: getTopBlock({x: data.bounds.rx, z: data.bounds.rz}), type: "glowstone" },
//           { x: data.bounds.rx, z: data.bounds.rz - 1, y: getTopBlock({x: data.bounds.rx, z: data.bounds.rz - 1}), type: "gold_block" },
//           { x: data.bounds.rx - 1, z: data.bounds.rz, y: getTopBlock({x: data.bounds.rx - 1, z: data.bounds.rz}), type: "gold_block" },
//   
//           { x: data.bounds.rx, z: data.bounds.lz, y: getTopBlock({x: data.bounds.rx, z: data.bounds.lz}), type: "glowstone" },
//           { x: data.bounds.rx - 1, z: data.bounds.lz, y: getTopBlock({x: data.bounds.rx - 1, z: data.bounds.lz}), type: "gold_block" },
//           { x: data.bounds.rx, z: data.bounds.lz + 1, y: getTopBlock({x: data.bounds.rx, z: data.bounds.lz + 1}), type: "gold_block" }
//         ]

        
        
        const cornerOffsets = [
          { dx: 0, dz: 0, type: "glowstone" },
          { dx: 1, dz: 0, type: "gold_block" },
          { dx: 0, dz: 1, type: "gold_block" }
        ];
        
        const baseCorners = [
          { x: data.bounds.lx, z: data.bounds.rz },
          { x: data.bounds.lx, z: data.bounds.lz },
          { x: data.bounds.rx, z: data.bounds.lz },
          { x: data.bounds.rx, z: data.bounds.rz }
        ];
        
        let corners = [];
        
        // Responsible for setting up the corner part of the land
        for (const base of baseCorners) {
          for (const offset of cornerOffsets) {
            const x = base.x + offset.dx * (base.x === data.bounds.rx ? -1 : 1);
            const z = base.z + offset.dz * (base.z === data.bounds.rz ? -1 : 1);
            const y = getTopBlock({ x, z });
        
            corners.push({ x, y, z, type: offset.type });
          }
        }
        
        // Responsible for in-between edit blocks
        for (let i = 0; i < baseCorners.length; i++) {
          const current = baseCorners[i];
          const next = baseCorners[(i + 1) % baseCorners.length];
        
          if (current.x === next.x) {
            const step = current.z < next.z ? 10 : -10;
            for (let z = current.z; step > 0 ? z <= next.z : z >= next.z; z += step) {
              const remaining = Math.abs(next.z - z);
              if (remaining >= 6) {
                const y = getTopBlock({ x: current.x, z });
                corners.push({ x: current.x, y, z, type: "gold_block" });
              }
            }
          } else if (current.z === next.z) {
            const step = current.x < next.x ? 10 : -10;
            for (let x = current.x; step > 0 ? x <= next.x : x >= next.x; x += step) {
              const remaining = Math.abs(next.x - x);
              if (remaining >= 6) {
                const y = getTopBlock({ x, z: current.z });
                corners.push({ x, y, z: current.z, type: "gold_block" });
              }
            }
          }
        }
        
        let isCurrentlyOverlapState = db.fetch(`overlapCacheBlocks:${data.id}`, true)
        
        // Handle replacing blocks at specified location
        for(const pos of corners) {
          const block = dimension.getBlock({x: pos.x, y: pos.y, z: pos.z})
          // Avoid outline blocks (aka edit blockd) to be permanently implemented to the world.
          if(playerCacheBlocks.find(d => d.location.x === pos.x && d.location.y === pos.y && d.location.z === pos.z)) continue;
          let currentOverlapBlock = isCurrentlyOverlapState.find(d => d.location.x === pos.x && d.location.y === pos.y && d.location.z === pos.z)
          isCurrentlyOverlapState = isCurrentlyOverlapState.filter(d => !(d.location.x === pos.x && d.location.y === pos.y && d.location.z === pos.z))
          playerCacheBlocks.push({
            owner: player.name.toLowerCase(),
            landId: data.id,
            originalBlock: currentOverlapBlock?.originalBlock || block?.typeId,
            temporaryBlock: pos.type,
            location: { x: pos.x, y: pos.y, z: pos.z}
          })
          block?.setType(`minecraft:${pos.type}`)
        }
        db.store(`overlapCacheBlocks:${data.id}`, isCurrentlyOverlapState)
        db.store(`landCacheBlocks:${player.name.toLowerCase()}`, playerCacheBlocks)
      }
    } else {
      const editData = player.getTags().find(v => v.startsWith("editingLand:"))
      if(editData) {
        system.run(() => {
          player.removeTag(editData)
        })
      };
    }
  })
}, 20)