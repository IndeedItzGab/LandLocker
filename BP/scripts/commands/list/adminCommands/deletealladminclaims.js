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
  permissionLevel: 2,
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