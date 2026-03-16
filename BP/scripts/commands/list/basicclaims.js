import {
  system
} from "@minecraft/server";
import { registerCommand }  from "../CommandRegistry.js"
import { messages } from "../../messages.js"
import * as db from "../../utilities/DatabaseHandler.js"

const commandInformation = {
  name: "basicclaims",
  description: "Puts your shovel back in basic claims mode.",
  aliases: ["bc"],
  usage:[]
}

let cooldowns = new Map()
registerCommand(commandInformation, (origin) => {
  
  const player = origin.sourceEntity
  const setting = db.fetch("landlocker:setting")

  // Cooldown
  const cooldown = cooldowns.get(player.id)
  if(cooldown?.tick >= system.currentTick) {
    return player.sendMessage(`§c${messages.CommandCooldown.replaceAll("{0}", (cooldown.tick - system.currentTick) / 20)}`)
  } else {
    cooldowns.set(player.id, {tick: system.currentTick + setting.commands["cooldown"]*20})
  }

  system.run(() => {
    player.removeTaf("shovelMode:subdivisionClaims")
    player.removeTag("shovelMode:adminClaims")
  })
  player.sendMessage(`§a${messages.BasicClaimsMode}`)
  return {
    status: 0
  }
})