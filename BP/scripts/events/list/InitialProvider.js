import { world, system } from "@minecraft/server"

world.afterEvents.playerSpawn.subscribe((event) => {
  const player = event.player
  if(player.playerPermissionLevel === 2 && !player.hasTag("landlocker:initialProvider")) {
    system.run(() => {
      player.addTag("landlocker:initialProvider")
      player.runCommand(`give @s landlocker:setting`)
      player.sendMessage(`§eA configuration file of LandLocker was given to you.`)
    })

  }
})