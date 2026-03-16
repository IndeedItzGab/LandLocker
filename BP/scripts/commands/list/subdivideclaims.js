import {
  system
} from "@minecraft/server";
import { registerCommand }  from "../CommandRegistry.js"
import { messages } from "../../messages.js"
import * as db from "../../utilities/DatabaseHandler.js"

const commandInformation = {
  name: "subdivideclaims",
  description: "Switches your shovel to subdivision mode, so you can subdivide your claims.",
  aliases: ["sc"],
  usage:[]
}

let cooldowns = new Map()
registerCommand(commandInformation, (origin) => {
  const setting = db.fetch("landlocker:setting")
  const player = origin.sourceEntity
  
  // Cooldown
  const cooldown = cooldowns.get(player.id)
  if(cooldown?.tick >= system.currentTick) {
    return player.sendMessage(`§c${messages.CommandCooldown.replaceAll("{0}", (cooldown.tick - system.currentTick) / 20)}`)
  } else {
    cooldowns.set(player.id, {tick: system.currentTick + setting.commands["cooldown"]*20})
  }
  
  const usedItem = player?.getComponent("inventory")?.container?.getItem(player?.selectedSlotIndex)
  if(usedItem?.typeId !== setting.claims["modificationTool"]) return player.sendMessage(`§c${messages.MustHoldModificationToolForThat}`)
    
  system.run(() => {
    player.removeTag("shovelMode:adminClaims")
    player.addTag("shovelMode:subdivisionClaims")
  })
  player.sendMessage(`§a${messages.SubdivisionMode}`)
  return {
    status: 0
  }
})