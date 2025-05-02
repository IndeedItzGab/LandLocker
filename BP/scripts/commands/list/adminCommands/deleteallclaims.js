import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../../commandRegistry.js"
import * as db from "../../../utilities/storage.js"

const commandInformation = {
  name: "deleteallclaims",
  description: "Deletes all of another player's claims.",
  aliases: [],
  permissionLevel: 2,
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

  if(!db.fetch("landPlayersList", true).some(data => data.name.toLowerCase() === targetPlayerName.toLowerCase())) return player.sendMessage(`§cNo player by that name has logged in recently.`)
  db.store("land", db.fetch("land", true).filter(data => data?.owner.toLowerCase() !== targetPlayerName.toLowerCase()))
  player.sendMessage(`§aDeleted all of ${targetPlayerName}'s claims.`)

  return {
    status: 0
  }
})