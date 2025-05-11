import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../../commandRegistry.js"
import { messages } from "../../../messages.js"


const commandInformation = {
  name: "adminclaims",
  description: "Switches the shovel tool to administrative claims mode.",
  aliases: ["ac"],
  permissionLevel: 2,
  usage:[]
}

registerCommand(commandInformation, (origin) => {
  
  const player = origin.sourceEntity
  const usedItem = player?.getComponent("inventory")?.container?.getItem(player?.selectedSlotIndex)
  if(usedItem?.typeId !== "minecraft:golden_shovel") return player.sendMessage(`§c${messages.MustHoldModificationToolForThat}`)
  system.run(() => {
    player.addTag("shovelMode:adminClaims")
  })
  player.sendMessage(`§a${messages.AdminClaimsMode}`)
  return {
    status: 0
  }
})