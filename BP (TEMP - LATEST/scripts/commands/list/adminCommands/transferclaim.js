import { registerCommand }  from "../../CommandRegistry.js"
import * as db from "../../../utilities/DatabaseHandler.js"
import { messages } from "../../../messages.js"
import "../../../utilities/LandValidation.js"

const commandInformation = {
  name: "transferclaim",
  description: "Converts an administrative claim to a private claim.",
  permissionLevel: 1,
  aliases: [],
  usage:[
    {
      name: "player",
      type: "String",
      optional: false
    }
  ]
}

registerCommand(commandInformation, (origin, targetPlayerName) => {
  

  const player = origin.sourceEntity
  const c = checkLand(player)

  let landPlayersList = db.fetch("landPlayersList", true)
  let targetPlayerData = landPlayersList.find(data => data.name.toLowerCase() === targetPlayerName.toLowerCase())
  if(!c) return player.sendMessage(`§c${messages.TransferClaimMissing}`)
  //if(c?.owner) return player.sendMessage(`§c${messages.TransferClaimAdminOnly}`)
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