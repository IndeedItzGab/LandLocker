import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../../commandRegistry.js"
import * as db from "../../../utilities/storage.js"

const commandInformation = {
  name: "adjustbonusclaimblocks",
  description: "Adds or subtracts bonus claim blocks for a player.",
  aliases: ["acb"],
  permissionLevel: 2,
  usage:[
    {
      name: "player",
      type: 3,
      optional: false
    },
    {
      name: "count",
      type: 1,
      optional: false
    }
  ]
}

registerCommand(commandInformation, (origin, targetPlayerName, count) => {

  const player = origin.sourceEntity

  let landPlayersList = db.fetch("landPlayersList", true)
  
  let targetPlayerData = landPlayersList.find(data => data.name.toLowerCase() === targetPlayerName.toLowerCase())
  if(!targetPlayerData) return player.sendMessage(`§cNo player by that name has logged in recently.`)
  targetPlayerData.claimBlocks.bonus = Math.max(0, targetPlayerData.claimBlocks.bonus + parseInt(count));
  
  db.store("landPlayersList", landPlayersList);
  player.sendMessage(`§aAdjusted ${targetPlayerName}'s bonus claim blocks by ${count}. New total bonus blocks: ${targetPlayerData.claimBlocks.bonus}.`)

  return {
    status: 0
  }
})