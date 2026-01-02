import { world, system } from "@minecraft/server"
import { messages } from "../../messages.js"

system.runInterval(() => {
  [...world.getPlayers()].forEach(player => {
    const inv = player.getComponent("inventory").container
    if(inv.size === inv.emptySlotsCount && !player.hasTag("safeCombat.emptyInventory")) {
      player.addTag("safeCombat.emptyInventory")
      player.sendMessage(`§e${messages.PvPImmunityStart}`)
    } else if(inv.size !== inv.emptySlotsCount && player.hasTag("safeCombat.emptyInventory")) {
      player.removeTag("safeCombat.emptyInventory")
      player.sendMessage(`§e${messages.PvPImmunityEnd}`)
    }
  }) 
}, 20)

