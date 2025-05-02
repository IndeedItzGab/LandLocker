import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../../commandRegistry.js"
import * as db from "../../../utilities/storage.js"

const commandInformation = {
  name: "adjustbonusclaimblockall",
  description: "Adds or subtracts bonus claim blocks for all online players.",
  aliases: [],
  permissionLevel: 2,
  usage:[
    {
      name: "count",
      type: 1,
      optional: false
    }
  ]
}

registerCommand(commandInformation, (origin, count) => {
  


  const player = origin.sourceEntity

  let landPlayersList = db.fetch("landPlayersList", true)
  world.getPlayers().forEach(targetPlayer => {
    let playerData = landPlayersList.find(data => data.name.toLowerCase() === targetPlayer.name.toLowerCase())
    playerData.claimBlocks.bonus = Math.max(0, playerData.claimBlocks.bonus + parseInt(count));
  })

  db.store("landPlayersList", landPlayersList);
  player.sendMessage(`§aAdjusted all online players' bonus claim blocks by ${count}.`)

  return {
    status: 0
  }
})