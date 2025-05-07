import { world, system } from "@minecraft/server";
import * as db from "./storage.js";

globalThis.overlapCheck = (player, lx = null, rx = null, lz = null, rz = null, landID = null) => {
  lx = lx ? lx : player.location.x-5
  rx = rx ? rx : player.location.x+5
  lz = lz ? lz : player.location.z-5
  rz = rz ? rz : player.location.z+5
  for(const data of db.fetch("land", true)) {
    if(landID === data.id) continue;
    if (
      data &&
      data.bounds.lx <= rx &&
      data.bounds.rx >= lx &&
      data.bounds.lz <= rz &&
      data.bounds.rz >= lz
    ) {
      let currentOwnerIsEditing = JSON.parse((world.scoreboard.getObjective(`landCacheBlocks:${data.owner}`)?.displayName || '[]')).length !== 0
      let overlapCacheBlocks = db.fetch(`overlapCacheBlocks:${data.id}`, true)
      if(!currentOwnerIsEditing) {
        const cornerOffsets = [
          { dx: 0, dz: 0, type: "lit_redstone_ore" },
          { dx: 1, dz: 0, type: "netherrack" },
          { dx: 0, dz: 1, type: "netherrack" }
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
                if(z === current.z) continue
                const y = getTopBlock({ x: current.x, z });
                corners.push({ x: current.x, y, z, type: "netherrack" });
              }
            }
          } else if (current.z === next.z) {
            const step = current.x < next.x ? 10 : -10;
            for (let x = current.x; step > 0 ? x <= next.x : x >= next.x; x += step) {
              const remaining = Math.abs(next.x - x);
              if (remaining >= 6) {
                if(x === current.x) continue
                const y = getTopBlock({ x, z: current.z });
                corners.push({ x, y, z: current.z, type: "netherrack" });
              }
            }
          }
        }
        
        let newData = []
        for(const pos of corners) {
          const block = player.dimension.getBlock({x: pos.x, y: pos.y, z: pos.z})
          // Avoid making netherrack & lit_redstone_ore into a original block as it will make it permanently implemented in the world.
          if(block?.typeId === "minecraft:netherrack" || block?.typeId === "minecraft:lit_redstone_ore") continue;
          const recentOriginalBlock = overlapCacheBlocks.find(d => d.location.x === pos.x && d.location.y === pos.y && d.location.z === pos.z)
          newData.push({
            tick: system.currentTick + (30*20),
            landId: data.id,
            originalBlock: recentOriginalBlock?.originalBlock || block?.typeId,
            temporaryBlock: pos.type,
            location: { x: pos.x, y: pos.y, z: pos.z}
          })
          system.run(() => {
            block?.setType(`minecraft:${pos.type}`)
          })
        }
        db.store(`overlapCacheBlocks:${data.id}`, newData)
      }
      return data;
    }
  }
  return null;
}