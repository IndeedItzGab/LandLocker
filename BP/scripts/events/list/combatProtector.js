import { world } from "@minecraft/server"

world.afterEvents.entityHitEntity.subscribe((event) => {
  if(event.hitEntity.typeId !== "minecraft:player" || event.damagingEntity.typeId !== "minecraft:player") return
  if(event.hitEntity.hasTag("safeCombat.emptyInventory")) {
    player.sendMessage(`§cYou can't injure defenseless players.`)
  } else if(event.damagingEntity.hasTag("safeCombat.emptyInventory")) {
    player.sendMessage(`§cYou can't fight someone while you're protected from PvP.`)
  }
})