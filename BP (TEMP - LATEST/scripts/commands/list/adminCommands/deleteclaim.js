import { registerCommand }  from "../../CommandRegistry.js"
import * as db from "../../../utilities/DatabaseHandler.js"
import { messages } from "../../../messages.js"
import "../../../utilities/LandValidation.js"

const commandInformation = {
  name: "deleteclaim",
  description: "Deletes the claim you're standing in, even if it's not your claim.",
  permissionLevel: 1,
  aliases: ["dl"],
  usage:[]
}

registerCommand(commandInformation, (origin) => {
  
  
  const player = origin.sourceEntity

  const c = checkLand(player)

  if(!c) return player.sendMessage(`§c${messages.DeleteClaimMissing}`)
  db.store("land", db.fetch("land", true).filter(data => data?.id !== c?.id))
  player.sendMessage(`§a${messages.DeleteSuccess}`)
  
  return {
    status: 0
  }
})