import { world } from "@minecraft/server"
import "../../utilities/LandValidation.js"

world.beforeEvents.explosion.subscribe((event) => {
  let affectedBlocks = event.getImpactedBlocks().filter(block => {
    let land = checkLand(block)
    return land ? land?.setting?.allowExplosions : true
  })
  event.setImpactedBlocks(affectedBlocks)
})