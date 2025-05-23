import { world } from "@minecraft/server"
import { messages } from "../../messages.js"

world.afterEvents.entityHitEntity.subscribe((event) => {
  if(event.hitEntity.typeId !== "minecraft:player" || event.damagingEntity.typeId !== "minecraft:player") return
  if(event.hitEntity.hasTag("safeCombat.emptyInventory")) {
    player.sendMessage(`§c${messages.ThatPlayerPvPImmune}`)
  } else if(event.damagingEntity.hasTag("safeCombat.emptyInventory")) {
    player.sendMessage(`§c${messages.CantFightWhileImmune}`)
  }
})