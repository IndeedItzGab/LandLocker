import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../../commandRegistry.js"
import * as db from "../../../utilities/storage.js"
import { messages } from "../../../messages.js"
import "../../../utilities/checkLand.js"

const commandInformation = {
  name: "transferclaim",
  description: "Converts an administrative claim to a private claim.",
  aliases: [],
  usage:[
    {
      name: "player",
      type: 3,
      optional: false
    }
  ]
}

registerCommand(commandInformation, (origin, targetPlayerName) => {
  

  const player = origin.sourceEntity
  const c = checkLand(player)
  if(!player.isAdmin()) return player.sendMessage(`§c${messages.TransferClaimPermission}`)
  let landPlayersList = db.fetch("landPlayersList", true)
  let targetPlayerData = landPlayersList.find(data => data.name.toLowerCase() === targetPlayerName.toLowerCase())
  if(!c) return player.sendMessage(`§c${messages.TransferClaimMissing}`)
  if(c?.owner) return player.sendMessage(`§c${messages.TransferClaimAdminOnly}`)
  if(!targetPlayerData) return player.sendMessage(`§c${messages.PlayerNotFound2}`)
  
  const lands = db.fetch("land", true)
  const land = lands.find(d => d.id === c.id)
  land.owner = targetPlayerName.toLowerCase()
  db.store("land", lands)
  
  player.sendMessage(`§a${messages.TransferSuccess}`)
 
  return {
    status: 0
  }
})