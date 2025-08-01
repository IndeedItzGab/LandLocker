import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../../commandRegistry.js"
import * as db from "../../../utilities/storage.js"
import { messages } from "../../../messages.js"

const commandInformation = {
  name: "adminclaimslist",
  description: "Lists all administrative claims.",
  permissionLevel: 1,
  aliases: [],
  usage:[]
}

registerCommand(commandInformation, (origin) => {
  

  const player = origin.sourceEntity

  const adminLands = db.fetch("land", true).filter(v => !v.owner);
  let l = `§e${messages.ClaimsListHeader}:`
  
  for(const land of adminLands) {
    l +=`\n§eworld: x${land.bounds.rx}, z${land.bounds.lz}`;
  }
  player.sendMessage(l)

  return {
    status: 0
  }
})