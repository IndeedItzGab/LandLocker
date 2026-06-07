import { world, system } from "@minecraft/server"
import * as db from "../../utilities/DatabaseHandler.js"


const playerTime = new Map()
world.afterEvents.playerJoin.subscribe((event) => playerTime.set(event.playerName, Date.now()))
world.afterEvents.playerLeave.subscribe((event) => playerTime.delete(event.playerName))

// Deliver the accrued blocks per 5 minutes, dividing the given deliver value with 12. 
system.runInterval(() => {
  const setting = db.fetch("landlocker:setting");
  const playersList = db.fetch("landPlayersList", true)
  for(const player of world.getPlayers()) {
    const time = playerTime.get(player.name)

    // Ensure the player is always in the list
    if(!time) {
      playerTime.set(player.name, Date.now())
    }

    if(player.isIdle() || time + 5*60*1000 >= Date.now()) continue;
    let playerData = playersList.find(data => data.name.toLowerCase() === player.name.toLowerCase())
    playerData.claimBlocks.play += Math.min(setting.claims["maxAccruedClaimBlocks"], setting.claims["claimBlocksAccruedPerHour"] / 12)
    db.store("landPlayersList", playersList)
    playerTime.set(player.name, Date.now())
  }
}, 5*20)
