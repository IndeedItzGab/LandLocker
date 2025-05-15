import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../../commandRegistry.js"
import * as db from "../../../utilities/storage.js"
import { messages } from "../../../messages.js"

const commandInformation = {
  name: "deletealladminclaims",
  description: "Deletes all administrative claims.",
  aliases: [],
  usage:[]
}

registerCommand(commandInformation, (origin) => {
  

  const player = origin.sourceEntity
  if(!player.isAdmin()) return player.sendMessage(`§c${messages.TransferClaimPermission}`)

  db.store("land", db.fetch("land", true).filter(data => data.owner))
  player.sendMessage(`§a${messages.AllAdminDeleted}`)

  return {
    status: 0
  }
})