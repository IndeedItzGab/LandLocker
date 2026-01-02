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
  permissionLevel: 1,
  aliases: ["scb"],
  usage:[
    {
      name: "player",
      type: "String",
      optional: false
    },
    {
      name: "amount",
      type: "Integer",
      optional: false
    }
  ]
}

registerCommand(commandInformation, (origin, targetPlayerName, amount) => {
  

  const player = origin.sourceEntity

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