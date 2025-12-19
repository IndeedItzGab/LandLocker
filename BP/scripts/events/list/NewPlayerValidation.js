import { world } from "@minecraft/server"
import * as db from "../../utilities/DatabaseHandler.js"
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
  db.store("landPlayersList", landPlayersList)
})