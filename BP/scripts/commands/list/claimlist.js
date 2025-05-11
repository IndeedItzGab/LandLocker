import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"
import "../../utilities/claimBlocks.js"
import { messages } from "../../messages.js"

const commandInformation = {
  name: "claimlist",
  description: "Lists a player's claims and claim block details.",
  aliases: ["claimslist"],
  usage:[
    {
      name: "player",
      type: 3,
      optional: true
    }
  ]
}

registerCommand(commandInformation, (origin, targetPlayerName) => {
  

  const player = origin.sourceEntity
  
  const lands = db.fetch("land", true).filter(v => v.owner?.toLowerCase() === player.name.toLowerCase());
  const target = targetPlayerName?.toLowerCase() || player.name?.toLowerCase()
  const playerStatus = db.fetch("landPlayersList", true).find(data => data?.name.toLowerCase() === target)
  if(!playerStatus) return player.sendMessage(`§c${messages.PlayerNotFound2}`)
  const play = playerStatus.claimBlocks.play
  const bonus = playerStatus.claimBlocks.bonus
  let l = ''
  if(lands.length === 0) {
    player.sendMessage(`§e${messages.StartBlockMath.replace("{0}", play).replace("{1}", bonus).replace("{2}", play + bonus)}`)
    return { status: 0 }
  }
  for(const land of lands) {
    l +=`\n§eworld: x${land.bounds.rx}, z${land.bounds.lz}${messages.ContinueBlockMath.replace("{0}", (Math.abs(land.bounds.rx - land.bounds.lx) + 1) * (Math.abs(land.bounds.rz - land.bounds.lz) + 1))}`;
  }
  player.sendMessage(`§e${messages.StartBlockMath.replace("{0}", play).replace("{1}", bonus).replace("{2}", play + bonus)}\n${messages.ClaimsListHeader}` + l + `§e\n${messages.EndBlockMath.replace("{0}", claimBlocks(player))}`)

  return {
    status: 0
  }
})