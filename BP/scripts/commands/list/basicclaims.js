import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import { messages } from "../../messages.js"
import { config } from "../../config.js"

const commandInformation = {
  name: "basicclaims",
  description: "Puts your shovel back in basic claims mode.",
  aliases: ["bc"],
  usage:[]
}

registerCommand(commandInformation, (origin) => {
  
  const player = origin.sourceEntity
  system.run(() => {
    player.removeTaf("shovelMode:subdivisionClaims")
    player.removeTag("shovelMode:adminClaims")
  })
  player.sendMessage(`§a${messages.BasicClaimsMode}`)
  return {
    status: 0
  }
})