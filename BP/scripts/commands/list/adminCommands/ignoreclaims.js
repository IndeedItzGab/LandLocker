import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../../commandRegistry.js"
import { messages } from "../../../messages.js"


const commandInformation = {
  name: "ignoreclaims",
  description: "Toggles ignore claims mode.",
  aliases: ["ic"],
  permissionLevel: 2,
  usage:[]
}

registerCommand(commandInformation, (origin) => {
  
  const player = origin.sourceEntity
  const statusTag = player.hasTag("landlocker:ignoringClaims")
  system.run(() => {
    statusTag ? player.removeTag("landlocker:ignoringClaims") : player.addTag("landlocker:ignoringClaims")
  })
  player.sendMessage(`§a${statusTag ? messages.RespectingClaims : messages.IgnoringClaims}`)
  return {
    status: 0
  }
})