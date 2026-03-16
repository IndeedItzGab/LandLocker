import { world } from "@minecraft/server"
import * as db from "../../utilities/DatabaseHandler.js"

world.afterEvents.playerSpawn.subscribe((event) => {
  const player = event.player
  const setting = db.fetch("landlocker:setting")
  const landPlayersList = db.fetch("landPlayersList", true) || []
  if(landPlayersList.some(e => e?.name.toLowerCase() === player.name.toLowerCase())) return; // Check if the player has recently joined the server.
  landPlayersList.push({
    name: player.name.toLowerCase(),
    claimBlocks: {
      play: setting.claims["initialBlocks"],
      bonus: 0
    }
  });
  db.store("landPlayersList", landPlayersList)
})