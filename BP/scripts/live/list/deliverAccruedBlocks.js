import { world, system } from "@minecraft/server"
import * as db from "../../utilities/storage.js"
import { config } from "../../config.js"

// Deliver the accrued blocks per 5 minutes, dividing the given deliver value with 12. 
globalThis.deliverAccruedBlocks = () => {
  [...world.getPlayers()].forEach(player => {
    if(player.isIdle()) return;
    let playersList = db.fetch("landPlayersList", true)
    let playerData = playersList.find(data => data.name.toLowerCase() === player.name.toLowerCase())
    playerData.claimBlocks.play += Math.min(config.LandLocker.Claims.Max_Accrued_Claim_Blocks.Default, Math.round(config.LandLocker.Claims.Claim_Blocks_Accrued_Per_Hour.Default / 12))
    db.store("landPlayersList", playersList)
  })
}