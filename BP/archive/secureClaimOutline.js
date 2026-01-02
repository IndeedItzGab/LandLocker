import { world, system } from "@minecraft/server"
import * as db from "../scripts/utilities/DatabaseHandler.js"
import "../scripts/utilities/LandValidation.js"

world.beforeEvents.playerBreakBlock.subscribe(event => {
  const block = event.block
  const overlapCacheBlocks = db.find("overlapCacheBlocks:")//world.scoreboard.getObjectives().filter(data => data.id.includes("overlapCacheBlocks:"))
  const allCacheBlocks = db.find("landCacheBlocks:")//world.scoreboard.getObjectives().filter(data => data.id.includes("landCacheBlocks:")).concat(overlapCacheBlocks)
  
  for(const cacheData of allCacheBlocks) {
    const cacheInfo = db.fetch(cacheData, true)
    const matchingCache = cacheInfo.find(cache => (
      cache.location?.x === block.location.x &&
      cache.location?.y === block.location.y &&
      cache.location?.z === block.location.z &&
      cache?.temporaryBlock === block.typeId
    ));
    
    if (matchingCache) {
      system.run(() => {
        block.setType(matchingCache.originalBlock);
        db.store(cacheData, cacheInfo.filter(d => d !== matchingCache)) 
        event.cancel = true
      })
    }
  }
})