import {
  system
} from "@minecraft/server";
import { registerCommand }  from "../CommandRegistry.js"
import * as db from "../../utilities/DatabaseHandler.js"
import "../../utilities/PlayerClaimBlocks.js"
import { messages } from "../../messages.js"

const commandInformation = {
  name: "abandonallclaims",
  description: "Deletes all of your claims.",
  aliases: [],
  usage:[
    {
      name: "args",
      type: "String",
      optional: true
    }
  ]
}

let cooldowns = new Map()
registerCommand(commandInformation, (origin, args) => {

  const player = origin.sourceEntity
  const setting = db.fetch("landlocker:setting")

  // Cooldown
  const cooldown = cooldowns.get(player.id)
  if(cooldown?.tick >= system.currentTick) {
    return player.sendMessage(`§c${messages.CommandCooldown.replaceAll("{0}", (cooldown.tick - system.currentTick) / 20)}`)
  }

  if(player.hasTag("deleteAllLandQuery") && args === "confirm") {
    system.run(() => {
      player.removeTag(`deleteAllLandQuery`)
    })
    db.store("land", db.fetch("land", true).filter(data => data.owner !== player.name.toLowerCase()));
    let remainingClaimBlocks = claimBlocks(player)
    player.sendMessage(`§a${messages.SuccessfulAbandon.replace("{0}", remainingClaimBlocks)}`)
    cooldowns.set(player.id, {tick: system.currentTick + setting.commands["cooldown"]*20})
  } else {
    system.run(() => {
      player.addTag(`deleteAllLandQuery`)
      player.sendMessage(`§c${messages.ConfirmAbandonAllClaims}`)
    })
  }
  
  return {
    status: 0
  }
})