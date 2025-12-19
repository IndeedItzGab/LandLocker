import {
  system
} from "@minecraft/server";
import { registerCommand }  from "../../CommandRegistry.js"
import { messages } from "../../../messages.js"
import { config } from "../../../config.js"

const commandInformation = {
  name: "adminclaims",
  description: "Switches the shovel tool to administrative claims mode.",
  permissionLevel: 1,
  aliases: ["ac"],
  usage:[]
}

registerCommand(commandInformation, (origin) => {
  
  const player = origin.sourceEntity

  const usedItem = player?.getComponent("inventory")?.container?.getItem(player?.selectedSlotIndex)
  if(usedItem?.typeId !== config.LandLocker.Claims.ModificationTool) return player.sendMessage(`§c${messages.MustHoldModificationToolForThat}`)
  system.run(() => {
    player.removeTag("shovelMode:subdivisionClaims")
    player.addTag("shovelMode:adminClaims")
  })
  player.sendMessage(`§a${messages.AdminClaimsMode}`)
  return {
    status: 0
  }
})