import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../CommandRegistry.js"
import { messages } from "../../messages.js"
import "../../utilities/LandValidation.js"
import "../../utilities/FetchTopBlock.js"
import * as db from "../../utilities/DatabaseHandler.js"

const commandInformation = {
  name: "trapped",
  description: "Gets a player out of a land claim he’s trapped inside.",
  aliases: [],
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

  const isAdmin = player.playerPermissionLevel === 2
  const c = checkLand(player)
  const isOwner = c?.owner === player.name.toLowerCase()
  
  if(isOwner || !c || c.publicPermissions.fullTrust || c.members.some(m => m.name === player.name.toLowerCase() && m.permissions.fullTrust) || (isAdmin && player.hasTag("landlocker:ignoringClaims"))) return player.sendMessage(`§c${messages.NotTrappedHere}`)
  player.sendMessage(`§6${messages.RescuePending}`)
  
  system.runTimeout(() => {
    const dimension = world.getDimension("minecraft:overworld")
    player.tryTeleport(world.getDefaultSpawnLocation(), dimension)
    system.runTimeout(() => {
      player.tryTeleport({x: world.getDefaultSpawnLocation().x, y: getTopBlock({x: world.getDefaultSpawnLocation().x, z: world.getDefaultSpawnLocation().z}), z: world.getDefaultSpawnLocation().z}, dimension)
    }, 1*20)
  }, 10*20)

  return {
    status: 0
  }
})