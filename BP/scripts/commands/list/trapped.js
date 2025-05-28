import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"
import { messages } from "../../messages.js"
import "../../utilities/checkLand.js"
import "../../utilities/getTopBlock.js"

const commandInformation = {
  name: "trapped",
  description: "Gets a player out of a land claim he’s trapped inside.",
  aliases: [],
  usage:[]
}

registerCommand(commandInformation, (origin) => {
  
  const player = origin.sourceEntity
  const isAdmin = player.isAdmin()
  const c = checkLand(player)
  const isOwner = c.owner === player.name.toLowerCase()
  
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