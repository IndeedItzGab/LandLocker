import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"
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
  if(origin.sourceBlock || origin.initiator || origin.sourceEntity.typeId !== "minecraft:player") return { status: 1 }
  
  const player = origin.sourceEntity
  const c = checkLand(player)
  const isOwner = c?.owner.toLowerCase() === player.name.toLowerCase()
  let lands = db.fetch("land", true)
    
  if (c?.id) {
    let land = lands.find(v => v?.id === c?.id);
    land.members = land.members || [];
    
    if(!isOwner) {
      if(targetPlayerName.toLowerCase() === "all") return player.sendMessage(`§cOnly the claim owner can clear all permissions.`)
      if(land.members.find(v => v.name.toLowerCase() === targetPlayerName.toLowerCase()).permissions.permissionTrust) return player.sendMessage(`§cOnly the claim owner can demote a manager.`)
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
  
  let who = !c?.id ? "§aCleared permisisons in ALL your claims. " : "§aCleared permissions in this claim. "
  let who2 = c?.id ? `§aRevoke ${targetPlayerName}'s access to this claim. ` : `§aRevoke ${targetPlayerName}'s to ALL your claims. `
  let where = c?.id ? "To set permission for ALL your claims, stand outside them." : "To set permissions for a single claim, stand inside it."
  player.sendMessage(`${targetPlayerName.toLowerCase() === "all" ? who : who2} ${where}`)
  db.store("land", lands);
  return {
    status: 0
  }
})