import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../../commandRegistry.js"
import * as db from "../../../utilities/storage.js"

const commandInformation = {
  name: "setaccruedclaimblocks",
  description: "Updates a player's accrued claim block total.",
  aliases: ["scb"],
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
  
  if(origin.sourceBlock || origin.initiator || origin.sourceEntity.typeId !== "minecraft:player") return { status: 1 }
  
  const player = origin.sourceEntity
  
  let landPlayersList = db.fetch("landPlayersList", true)
  let targetPlayerData = landPlayersList.find(data => data.name.toLowerCase() === targetPlayerName.toLowerCase())
  if(!targetPlayerData) return player.sendMessage(`§cNo player by that name has logged in recently.`)
  targetPlayerData.claimBlocks.play = parseInt(amount)
  db.store("landPlayersList", landPlayersList);
  player.sendMessage(`§aUpdated accrued claim blocks.`)
 
  return {
    status: 0
  }
})