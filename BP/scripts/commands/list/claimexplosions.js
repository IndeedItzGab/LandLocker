import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"
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
  const isOwner = c?.owner.toLowerCase() === player.name.toLowerCase()
  let lands = db.fetch("land", true)
  if(!c || !isOwner) return player.sendMessage(`§cThere's no claim here.`)
  player.sendMessage(`§a${c.setting.allowExplosions ? "This claim id now vulnerable yo explosions.  Use /lc:claimexplosions again to re-enable protections." : "This claim is now protected from explosions.  Use /lc:claimexplosions again to disable."}`)
  let land = lands.find(land => land.id === c.id)
  land.setting.allowExplosions = !land.setting.allowExplosions
  
  db.store("land", lands)
  return {
    status: 0
  }
})