import { world, system } from "@minecraft/server"
import * as db from "../scripts/utilities/storage.js" 

globalThis.overlapOutlineRemoval = () => {
  const allOverlapCacheData = db.find("overlapCacheBlocks:") //world.scoreboard.getObjectives().filter(data => data.id.includes("overlapCacheBlocks:"))
  for(const cache of allOverlapCacheData) {
    let blocksToBeRemoved = [];
    let overlapCacheBlocks = db.fetch(cache, true)
    for(const cacheBlock of overlapCacheBlocks) {
       const block = world.getDimension("overworld").getBlock({x: cacheBlock.location.x, y: cacheBlock.location.y, z: cacheBlock.location.z})

      if(cacheBlock.tick >= system.currentTick || block?.typeId === "undefine") continue;
      block?.setType(cacheBlock.originalBlock)
      if(block) blocksToBeRemoved.push(cacheBlock)
      //\\ if(block) playerCacheBlocks = playerCacheBlocks.filter(data => data.location.x !== cacheBlock.location.x && data.location.y !== cacheBlock.location.y && data.location.z !== cacheBlock.location.z)
    }
    overlapCacheBlocks = overlapCacheBlocks.filter(data => !blocksToBeRemoved.includes(data))
    db.store(cache, overlapCacheBlocks)
  }
    
}