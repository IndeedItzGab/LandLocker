import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"
import "../../utilities/claimBlocks.js"

const commandInformation = {
  name: "claimlist",
  description: "Lists a player's claims and claim block details.",
  aliases: ["claimslist"],
  usage:[]
}

registerCommand(commandInformation, (origin) => {
  
  if(origin.sourceBlock || origin.initiator || origin.sourceEntity.typeId !== "minecraft:player") return { status: 1 }
  
  const player = origin.sourceEntity
  
  const lands = db.fetch("land", true).filter(v => v.owner.toLowerCase() === player.name.toLowerCase());
  const playerStatus = db.fetch("landPlayersList", true).find(data => data?.name.toLowerCase() === player.name.toLowerCase())
  const play = playerStatus.claimBlocks.play
  const bonus = playerStatus.claimBlocks.bonus
  let l = ''
  if(lands.length === 0) {
    player.sendMessage(`§e${play} blocks from play + ${bonus} bonus = ${play + bonus} total.`)
    return { status: 0 }
  }
  for(const land of lands) {
    l +=`\n§eworld: x${land.bounds.rx}, z${land.bounds.lz} {-${(Math.abs(land.bounds.rx - land.bounds.lx) + 1) * (Math.abs(land.bounds.rz - land.bounds.lz) + 1)} blocks}`;
  }
  player.sendMessage(`§e${play} blocks from play + ${bonus} bonus = ${play + bonus} total.\nClaims:` + l + `§e\n = ${claimBlocks(player)} blocks left to spend`)

  return {
    status: 0
  }
})