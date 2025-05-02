import { world } from "@minecraft/server"
import * as db from "../../utilities/storage.js"
import { config } from "../../config.js"

world.afterEvents.playerSpawn.subscribe((event) => {
  const player = event.player
  const landPlayersList = db.fetch("landPlayersList", true) || []
  if(landPlayersList.some(e => e?.name.toLowerCase() === player.name.toLowerCase())) return; // Check if the player has recently joined the server.
  landPlayersList.push({
    name: player.name.toLowerCase(),
    claimBlocks: {
      play: config.LandLocker.Claims.InitialBlocks,
      bonus: 0
    }
  });
  player.runCommand("give @s minecraft:golden_shovel")
  player.sendMessage(`§eYou were given a newbie-kit from LandLocker! containing Golden Shovel only.`)
  db.store("landPlayersList", landPlayersList)
})