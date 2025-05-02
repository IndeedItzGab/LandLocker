import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../../commandRegistry.js"
import * as db from "../../../utilities/storage.js"
import "../../../utilities/checkLand.js"

const commandInformation = {
  name: "deleteclaim",
  description: "Deletes the claim you're standing in, even if it's not your claim.",
  aliases: ["dl"],
  permissionLevel: 2,
  usage:[]
}

registerCommand(commandInformation, (origin) => {
  
  
  const player = origin.sourceEntity
  const c = checkLand(player)

  if(!c) return player.sendMessage(`§cThere's no claim here.`)
  db.store("land", db.fetch("land", true).filter(data => data?.id !== c?.id))
  player.sendMessage(`§aClaim deleted.`)
  
  return {
    status: 0
  }
})