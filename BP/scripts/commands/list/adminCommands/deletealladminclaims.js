import { registerCommand }  from "../../CommandRegistry.js"
import * as db from "../../../utilities/DatabaseHandler.js"
import { messages } from "../../../messages.js"

const commandInformation = {
  name: "deletealladminclaims",
  description: "Deletes all administrative claims.",
  permissionLevel: 1,
  aliases: [],
  usage:[]
}

registerCommand(commandInformation, (origin) => {
  

  const player = origin.sourceEntity

  db.store("land", db.fetch("land", true).filter(data => data.owner))
  player.sendMessage(`§a${messages.AllAdminDeleted}`)

  return {
    status: 0
  }
})