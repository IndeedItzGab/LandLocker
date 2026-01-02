import { registerCommand }  from "../../CommandRegistry.js"
import * as db from "../../../utilities/DatabaseHandler.js"
import { messages } from "../../../messages.js"

const commandInformation = {
  name: "deleteallclaims",
  description: "Deletes all of another player's claims.",
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

  if(!db.fetch("landPlayersList", true).some(data => data.name.toLowerCase() === targetPlayerName.toLowerCase())) return player.sendMessage(`§c${messages.PlayerNotFound2}`)
  db.store("land", db.fetch("land", true).filter(data => data.owner?.toLowerCase() !== targetPlayerName.toLowerCase()))
  player.sendMessage(`§a${messages.DeleteAllSuccess.replace("{0}", targetPlayerName)}`)

  return {
    status: 0
  }
})