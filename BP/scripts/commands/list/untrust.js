import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"
import { messages } from "../../messages.js"
import "../../utilities/checkLand.js"

const commandInformation = {
  name: "untrust",
  description: "Revokes any permissions granted to a player in your claim.",
  aliases: [],
  usage:[
    {
      name: "player",
      type: 3,
      optional: false
    }
  ]
}

registerCommand(commandInformation, (origin, targetPlayerName) => {

  const player = origin.sourceEntity
  const c = checkLand(player)
  const isOwner = c.owner?.toLowerCase() === player.name.toLowerCase()
  let lands = db.fetch("land", true)
    
  if (c?.id) {
    let land = lands.find(v => v?.id === c?.id);
    land.members = land.members || [];
    
    if(!isOwner) {
      if(targetPlayerName.toLowerCase() === "all") return player.sendMessage(`§c${messages.ClearPermsOwnerOnly}`)
      // Marked, if player with no permission manager successfully used this, fix it.
      if(land.members.find(v => v.name.toLowerCase() === targetPlayerName.toLowerCase()).permissions.permissionTrust) return player.sendMessage(`§c${messages.ManagersDontUntrustManagers}`)
    }
    untrustPermission(land, targetPlayerName, player, false);
    lands = lands.map(l => l.id === land.id ? land : l);
  } else {
    lands = lands.filter(v => v.owner === player.name.toLowerCase());
    for (let land of lands) {
      land.members = land.members || [];
      untrustPermission(land, targetPlayerName, player, true);
    }
  }
  

  if(c?.id && targetPlayerName.toLowerCase() === "all") {
    message = `§a${messages.ClearPermissionsOneClaim}`
  } else if(c?.id && targetPlayerName.toLowerCase() !== "all") {
    message = `§a${messages.UntrustIndividualSingleClaim.replace("{0}", targetPlayerName)}`
  } else if(!c?.id && targetPlayerName.toLowerCase() === "all") {
    message = `§a${messages.UntrustEveryoneAllClaims}`
  } else {
    message = `§a${messages.UntrustIndividualAllClaims.replace("{0}", targetPlayerName)}`
  }
  
  player.sendMessage(message)
  db.store("land", lands);
  return {
    status: 0
  }
})