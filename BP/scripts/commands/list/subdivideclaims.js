import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import { messages } from "../../messages.js"
import { config } from "../../config.js"

const commandInformation = {
  name: "subdivideclaims",
  description: "Switches your shovel to subdivision mode, so you can subdivide your claims.",
  aliases: ["sc"],
  usage:[]
}

registerCommand(commandInformation, (origin) => {
  
  const player = origin.sourceEntity
  const usedItem = player?.getComponent("inventory")?.container?.getItem(player?.selectedSlotIndex)
  if(usedItem?.typeId !== config.LandLocker.Claims.ModificationTool) return player.sendMessage(`§c${messages.MustHoldModificationToolForThat}`)
    
  system.run(() => {
    player.removeTag("shovelMode:adminClaims")
    player.addTag("shovelMode:subdivisionClaims")
  })
  player.sendMessage(`§a${messages.SubdivisionMode}`)
  return {
    status: 0
  }
})