import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../../commandRegistry.js"
import * as db from "../../../utilities/storage.js"
import { messages } from "../../../messages.js"

const commandInformation = {
  name: "setaccruedclaimblocks",
  description: "Updates a player's accrued claim block total.",
  aliases: ["scb"],
  usage:[
    {
      name: "player",
      type: 3,
      optional: false
    },
    {
      name: "amount",
      type: 1,
      optional: false
    }
  ]
}

registerCommand(commandInformation, (origin, targetPlayerName, amount) => {
  

  const player = origin.sourceEntity
  if(!player.isAdmin()) return player.sendMessage(`§c${messages.TransferClaimPermission}`)

  let landPlayersList = db.fetch("landPlayersList", true)
  let targetPlayerData = landPlayersList.find(data => data.name.toLowerCase() === targetPlayerName.toLowerCase())
  if(!targetPlayerData) return player.sendMessage(`§c${messages.PlayerNotFound2}`)
  targetPlayerData.claimBlocks.play = parseInt(amount)
  db.store("landPlayersList", landPlayersList);
  player.sendMessage(`§a${messages.SetClaimBlocksSuccess}`)
 
  return {
    status: 0
  }
})