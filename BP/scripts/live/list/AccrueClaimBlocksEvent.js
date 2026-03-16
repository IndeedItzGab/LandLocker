import { world, system } from "@minecraft/server"
import * as db from "../../utilities/DatabaseHandler.js"

// Deliver the accrued blocks per 5 minutes, dividing the given deliver value with 12. 
globalThis.AccrueClaimBlocksEvent = () => {
  const setting = db.fetch("landlocker:setting");
  [...world.getPlayers()].forEach(player => {
    if(player.isIdle()) return;
    let playersList = db.fetch("landPlayersList", true)
    let playerData = playersList.find(data => data.name.toLowerCase() === player.name.toLowerCase())
    playerData.claimBlocks.play += Math.min(setting.claims["maxAccruedClaimBlocks"], Math.round(setting.claims["claimBlocksAccruedPerHour"] / 12))
    db.store("landPlayersList", playersList)
  })
}