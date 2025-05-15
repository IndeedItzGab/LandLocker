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
  usage:[]
}

registerCommand(commandInformation, (origin) => {
  
  const player = origin.sourceEntity
  if(!player.isAdmin()) return player.sendMessage(`§c${messages.TransferClaimPermission}`)

  const statusTag = player.hasTag("landlocker:ignoringClaims")
  system.run(() => {
    statusTag ? player.removeTag("landlocker:ignoringClaims") : player.addTag("landlocker:ignoringClaims")
  })
  player.sendMessage(`§a${statusTag ? messages.RespectingClaims : messages.IgnoringClaims}`)
  return {
    status: 0
  }
})