import { world, system } from "@minecraft/server"
import * as db from "../../utilities/storage.js" 

system.runInterval(() => {
  const allOverlapCacheData= world.scoreboard.getObjectives().filter(data => data.id.includes("overlapCacheBlocks:"))
  for(const cache of allOverlapCacheData) {
    let blocksToBeRemoved = [];
    let overlapCacheBlocks = db.fetch(cache.id, true)
    for(const cacheBlock of overlapCacheBlocks) {
       const block = world.getDimension("overworld").getBlock({x: cacheBlock.location.x, y: cacheBlock.location.y, z: cacheBlock.location.z})

      // Just remove the cache block if it's already undefine
      if(cacheBlock?.originalBlock === undefined || cacheBlock?.originalBlock !== block.typeId) {
        blocksToBeRemoved.push(cacheBlock);
        continue;
      }
      if(cacheBlock.tick >= system.currentTick) continue;
      block?.setType(cacheBlock.originalBlock)
      if(block) blocksToBeRemoved.push(cacheBlock)
      //\\ if(block) playerCacheBlocks = playerCacheBlocks.filter(data => data.location.x !== cacheBlock.location.x && data.location.y !== cacheBlock.location.y && data.location.z !== cacheBlock.location.z)
    }
    overlapCacheBlocks = overlapCacheBlocks.filter(data => !blocksToBeRemoved.includes(data))
    db.store(cache.id, overlapCacheBlocks)
  }
    
}, 20)