import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../../commandRegistry.js"
import * as db from "../../../utilities/storage.js"
import { messages } from "../../../messages.js"

const commandInformation = {
  name: "adjustbonusclaimblocks",
  description: "Adds or subtracts bonus claim blocks for a player.",
  aliases: ["acb"],
  usage:[
    {
      name: "player",
      type: "String",
      optional: false
    },
    {
      name: "count",
      type: "Integer",
      optional: false
    }
  ]
}

registerCommand(commandInformation, (origin, targetPlayerName, count) => {

  const player = origin.sourceEntity
  if(!player.isAdmin()) return player.sendMessage(`§c${messages.TransferClaimPermission}`)

  let landPlayersList = db.fetch("landPlayersList", true)
  
  let targetPlayerData = landPlayersList.find(data => data.name.toLowerCase() === targetPlayerName.toLowerCase())
  if(!targetPlayerData) return player.sendMessage(`§c${messages.PlayerNotFound2}`)
  targetPlayerData.claimBlocks.bonus = Math.max(0, targetPlayerData.claimBlocks.bonus + parseInt(count));
  
  db.store("landPlayersList", landPlayersList);
  player.sendMessage(`§a${messages.AdjustBlocksSuccess.replace("{0}", targetPlayerName).replace("{1}", count).replace("{2}", targetPlayerData.claimBlocks.bonus)}`)

  return {
    status: 0
  }
})