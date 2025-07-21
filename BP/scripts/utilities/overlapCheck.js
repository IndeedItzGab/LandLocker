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
      const corners = visualization({red: 1, green: 0, blue: 0}, {red: 1, green: 0, blue: 0}, data)
      // Spawn the entity border that posses red particles indicating the claim is overlapped
      for(const pos of corners) {
        system.run(() => {
          const entity = world.getDimension(player.dimension.id).spawnEntity("landlocker:border", {x: pos.x + 0.5, y: pos.y, z: pos.z + 0.5})
          entity?.addTag(`landlocker:${player.id}`)
          entity?.addTag(`landlocker:border:${pos.color}`)
          entity?.addEffect("minecraft:slowness", 99999, {amplifier: 255, showParticles: false})
          entity?.addEffect("minecraft:invisibility", 99999, {amplifier: 255, showParticles: false})
        })
      }

      // Remove overlap entities after five seconds.
      system.runTimeout(() => {
        player.dimension.getEntities().forEach(entity => {
          try {
            const color = JSON.parse(entity.getTags().find(tag => tag.startsWith("landlocker:border:")).slice("landlocker:border:".length).replace(":primary", ''))
            if(color?.red === 1 && color?.green === 0 && color?.blue === 0) {
              entity?.remove()
            }
          } catch (err) {}
        })
      }, 20*5)
      
      return data;
    }
  }
  return null;
}