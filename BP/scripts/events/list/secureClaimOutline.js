import { world, system } from "@minecraft/server"
import * as db from "../../utilities/storage.js"
import "../../utilities/checkLand.js"

world.beforeEvents.playerBreakBlock.subscribe(event => {
  const block = event.block
  const overlapCacheBlocks = world.scoreboard.getObjectives().filter(data => data.id.includes("overlapCacheBlocks:"))
  const allCacheBlocks = world.scoreboard.getObjectives().filter(data => data.id.includes("landCacheBlocks:")).concat(overlapCacheBlocks)
  
  for(const cacheData of allCacheBlocks) {
    const cacheInfo = db.fetch(cacheData.id, true)
    const matchingCache = cacheInfo.find(cache => (
      cache.location?.x === block.location.x &&
      cache.location?.y === block.location.y &&
      cache.location?.z === block.location.z &&
      `minecraft:${cache?.temporaryBlock}` === block.typeId
    ));

    if (matchingCache) {
      system.run(() => {
        block.setType(matchingCache.originalBlock);
        event.cancel = true
      })
    }
  }
})