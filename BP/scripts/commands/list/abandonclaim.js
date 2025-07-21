import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import { messages } from "../../messages.js"
import * as db from "../../utilities/storage.js"
import "../../utilities/claimBlocks.js"
import "../../utilities/checkLand.js"
import "../../utilities/checkSubLand.js"

const commandInformation = {
  name: "abandonclaim",
  description: "Deletes the claim you're standing in.",
  aliases: ["declaim", "unclaim"],
  usage:[]
}

registerCommand(commandInformation, (origin) => {

  const player = origin.sourceEntity
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
    lands = lands.filter(d => d.id !== c?.id && d.owner === player.name.toLowerCase())
  }
  
  player.sendMessage(`§a${messages.AbandonSuccess.replace("{0}", claimBlocks(player))}`)
  db.store("land", lands)

  return {
    status: 0
  }
})