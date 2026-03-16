import { registerCommand }  from "../CommandRegistry.js"
import { messages } from "../../messages.js"
import * as db from "../../utilities/DatabaseHandler.js"
import "../../utilities/PlayerClaimBlocks.js"
import "../../utilities/LandValidation.js"
import "../../utilities/SubLandValidation.js"
import { system } from "@minecraft/server"

const commandInformation = {
  name: "abandonclaim",
  description: "Deletes the claim you're standing in.",
  aliases: ["declaim", "unclaim"],
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

  const c = checkLand(player)
  const sub = checkSubLand(player)
  const isOwner = c?.owner?.toLowerCase() === player.name.toLowerCase()

  if(!isOwner) return player.sendMessage(`§e${messages.AbandonClaimMissing}`)
  
  let lands = db.fetch("land", true)
  if(sub) {
    let land = lands.find(d => d.id === c?.id)
    if(!land) return;
    land.subdivisions = land?.subdivisions.filter(d => !(
      d.bounds.lx === sub.data.bounds.lx &&
      d.bounds.rx === sub.data.bounds.rx &&
      d.bounds.lz === sub.data.bounds.lz &&
      d.bounds.rz === sub.data.bounds.rz
    ))
  } else {
    lands = lands.filter(d => !(d.id === c?.id && d.owner === player.name.toLowerCase()))
  }
  
  player.sendMessage(`§a${messages.AbandonSuccess.replace("{0}", claimBlocks(player))}`)
  db.store("land", lands)

  return {
    status: 0
  }
})