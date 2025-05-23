import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import { messages } from "../../messages.js"
import * as db from "../../utilities/storage.js"
import "../../utilities/claimBlocks.js"
import "../../utilities/checkLand.js"

const commandInformation = {
  name: "abandonclaim",
  description: "Deletes the claim you're standing in.",
  aliases: ["declaim", "unclaim"],
  usage:[]
}

registerCommand(commandInformation, (origin) => {

  const player = origin.sourceEntity
  const c = checkLand(player)
  const isOwner = c?.owner?.toLowerCase() === player.name.toLowerCase()

  if(!isOwner) return player.sendMessage(`§e${messages.AbandonClaimMissing}`)
  db.store("land", db.fetch("land", true).filter(data => data.id !== c?.id && data.owner === player.name.toLowerCase()));
  player.sendMessage(`§a${messages.AbandonSuccess.replace("{0}", claimBlocks(player))}`)

  return {
    status: 0
  }
})