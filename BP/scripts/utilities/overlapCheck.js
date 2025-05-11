import { world, system } from "@minecraft/server";
import * as db from "./storage.js";
import "./visualization.js"

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
      data.bounds.rz >= lz &&
      data.world === player.dimension.id
    ) {
      //let currentOwnerIsEditing = JSON.parse((world.scoreboard.getObjective(`landCacheBlocks:${data.owner}`)?.displayName || '[]')).length !== 0
      let currentOwnerIsEditing = db.fetch(`landCacheBlocks:${!data.owner ? "admin" : data.owner}`, true).length !== 0
      let overlapCacheBlocks = db.fetch(`overlapCacheBlocks:${data.id}`, true)
      
      if(!currentOwnerIsEditing) {
        const corners = visualization("landlocker:overlap_primary_block", "landlocker:overlap_secondary_block", data)
        
        let newData = []
        for(const pos of corners) {
          const block = player.dimension.getBlock({x: pos.x, y: pos.y, z: pos.z})
          // Avoid making netherrack & lit_redstone_ore into a original block as it will make it permanently implemented in the world.
          if(overlapCacheBlocks.some(d => d.location.x === pos.x && d.location.y === pos.y && d.location.z === pos.z)) continue;
          const recentOriginalBlock = overlapCacheBlocks.find(d => d.location.x === pos.x && d.location.y === pos.y && d.location.z === pos.z)
          newData.push({
            tick: system.currentTick + (30*20),
            landId: data.id,
            originalBlock: recentOriginalBlock?.originalBlock || block?.typeId,
            temporaryBlock: pos.type,
            location: { x: pos.x, y: pos.y, z: pos.z}
          })
          system.run(() => {
            block?.setType(pos.type)
          })
        }
        db.store(`overlapCacheBlocks:${data.id}`, newData)
      }
      return data;
    }
  }
  return null;
}