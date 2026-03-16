import { registerCommand }  from "../CommandRegistry.js"
import * as db from "../../utilities/DatabaseHandler.js"
import { messages } from "../../messages.js"
import "../../utilities/PlayerClaimBlocks.js"
import "../../utilities/LandValidation.js"
import "../../utilities/OverlapLandValidation.js"
import "../../utilities/RandomIDGenerator.js"
import "../../utilities/FetchTopBlock.js"
import { system } from "@minecraft/server"

const commandInformation = {
  name: "claimexplosion",
  description: "Toggles whether explosives may be used in specific land claim.",
  aliases: ["claimexplosions"],
  usage:[
  ]
}

let cooldowns = new Map()
registerCommand(commandInformation, (origin, args1) => {
  

  const player = origin.sourceEntity
  const setting = db.fetch("landlocker:setting")
  
  // Cooldown
  const cooldown = cooldowns.get(player.id)
  if(cooldown?.tick >= system.currentTick) {
    return player.sendMessage(`§c${messages.CommandCooldown.replaceAll("{0}", (cooldown.tick - system.currentTick) / 20)}`)
  } else {
    cooldowns.set(player.id, {tick: system.currentTick + setting.commands["cooldown"]*20})
  }

  const c = checkLand(player)
  const isOwner = c?.owner?.toLowerCase() === player.name.toLowerCase()
  let lands = db.fetch("land", true)
  if(!c || !isOwner) return player.sendMessage(`§c${messages.DeleteClaimMissing}`)
  player.sendMessage(`§a${!c.setting.allowExplosions ? messages.ExplosivesEnabled : messages.ExplosivesDisabled}`)
  let land = lands.find(land => land.id === c.id)
  land.setting.allowExplosions = !land.setting.allowExplosions
  
  db.store("land", lands)
  return {
    status: 0
  }
})