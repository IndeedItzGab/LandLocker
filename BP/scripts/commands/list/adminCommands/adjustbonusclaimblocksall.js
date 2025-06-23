import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../../commandRegistry.js"
import * as db from "../../../utilities/storage.js"
import { messages } from "../../../messages.js"

const commandInformation = {
  name: "adjustbonusclaimblockall",
  description: "Adds or subtracts bonus claim blocks for all online players.",
  aliases: [],
  usage:[
    {
      name: "count",
      type: "Integer",
      optional: false
    }
  ]
}

registerCommand(commandInformation, (origin, count) => {
  
  const player = origin.sourceEntity
  if(!player.isAdmin()) return player.sendMessage(`§c${messages.TransferClaimPermission}`)

  let landPlayersList = db.fetch("landPlayersList", true)
  world.getPlayers().forEach(targetPlayer => {
    let playerData = landPlayersList.find(data => data.name.toLowerCase() === targetPlayer.name.toLowerCase())
    playerData.claimBlocks.bonus = Math.max(0, playerData.claimBlocks.bonus + parseInt(count));
  })

  db.store("landPlayersList", landPlayersList);
  player.sendMessage(`§a${messages.AdjustBlocksAllSuccess.replace("{0}", count)}`)

  return {
    status: 0
  }
})