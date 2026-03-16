import { world } from "@minecraft/server"
import { messages } from "../../messages.js"
import "../../utilities/LandValidation.js"
import * as db from "../../utilities/DatabaseHandler.js"

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
  if(!event.isFirstEvent) return;
  const player = event.player
  const block = event.block
  const equipment = event.itemStack?.typeId
  const setting = db.fetch("landlocker:setting")

  if(equipment === setting.claims["investigationTool"]) {
    const land = checkLand(block)
    if(!land) return player.sendMessage(`§b${messages.BlockNotClaimed}`)
    let owner = land.owner ? land.owner : messages.OwnerNameForAdminClaims
    let message = `§b${messages.BlockClaimed.replace("{0}", owner)}`
    message += `\n §b ${Math.abs(land.bounds.rx - land.bounds.lx) + 1}x${Math.abs(land.bounds.rz- land.bounds.lz) + 1}=${(Math.abs(land.bounds.rx - land.bounds.lx) + 1)*(Math.abs(land.bounds.rz- land.bounds.lz) + 1)}`
    player.sendMessage(message)
  }
})