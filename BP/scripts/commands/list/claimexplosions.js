import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"
import { messages } from "../../messages.js"
import "../../utilities/claimBlocks.js"
import "../../utilities/checkLand.js"
import "../../utilities/overlapCheck.js"
import "../../utilities/generateID.js"
import "../../utilities/getTopBlock.js"

const commandInformation = {
  name: "claimexplosion",
  description: "Toggles whether explosives may be used in specific land claim.",
  aliases: ["claimexplosions"],
  usage:[
  ]
}

registerCommand(commandInformation, (origin, args1) => {
  

  const player = origin.sourceEntity
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