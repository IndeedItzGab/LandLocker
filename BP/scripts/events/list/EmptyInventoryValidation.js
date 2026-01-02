import { world, system } from "@minecraft/server"
import { messages } from "../../messages.js"

world.afterEvents.playerInventoryItemChange.subscribe((event) => {
  const player = event.player
  const inv = player.getComponent("inventory").container
  if(inv.size === inv.emptySlotsCount && !player.hasTag("landlocker:safeCombat.emptyInventory")) {
    player.addTag("landlocker:safeCombat.emptyInventory")
    player.sendMessage(`§e${messages.PvPImmunityStart}`)
  } else if(inv.size !== inv.emptySlotsCount && player.hasTag("landlocker:safeCombat.emptyInventory")) {
    player.removeTag("landlocker:safeCombat.emptyInventory")
    player.sendMessage(`§e${messages.PvPImmunityEnd}`)
  }
})

