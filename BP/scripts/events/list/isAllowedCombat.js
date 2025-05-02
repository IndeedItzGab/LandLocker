import { world, system } from "@minecraft/server"

system.runInterval(() => {
  [...world.getPlayers()].forEach(player => {
    const inv = player.getComponent("inventory").container
    if(inv.size === inv.emptySlotsCount && !player.hasTag("safeCombat.emptyInventory")) {
      player.addTag("safeCombat.emptyInventory")
      player.sendMessage(`§eYou're protected from attack by other players as long as your inventory is empty.`)
    } else if(inv.size !== inv.emptySlotsCount && player.hasTag("safeCombat.emptyInventory")) {
      player.removeTag("safeCombat.emptyInventory")
      player.sendMessage(`§eNow you can fight with other players.`)
    }
  }) 
}, 20)

