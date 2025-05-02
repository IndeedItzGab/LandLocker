import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"
import "../../utilities/checkLand.js"
import "../../utilities/trustUtility/trustPerms.js"

const commandInformation = {
  name: "accesstrust",
  description: "Gives a player permission to use your buttons, levers, and beds.",
  aliases: ["at"],
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
  const isOwner = c?.owner.toLowerCase() === player.name.toLowerCase()
  let lands = db.fetch("land", true)
  
  if(isOwner && !c) return player.sendMessage(`§cStand inside the claim where you want to grant permission.`)
  
  if (c?.id) {
    let land = lands.find(v => v?.id === c?.id);
    land.members = land.members || [];
    
    if(!isOwner) {
      const playerLandData = land.members.find(v => v.name.toLowerCase() === player.name.toLowerCase() && land.owner.toLowerCase() !== player.name.toLowerCase())
      if(playerLandData?.permissions?.permissionTrust === false || !playerLandData) return player.sendMessage(`§cYou don't have ${land.owner}'s permission to manage permissions here.`);
      if(!playerLandData?.permissions?.accessTrust) return player.sendMessage(`§cYou can't grant a permission you don't have yourself.`)
    }

    updatePermissions(land, targetPlayerName.toLowerCase(), "accessTrust", player, false);
    lands = lands.map(l => l.id === land.id ? land : l);
  } else {
   for (let land of lands.filtrr(data => data.owner === player.name.toLowerCase())) {
      land.members = land.members || [];
      updatePermissions(land, targetPlayerName.toLowerCase(), "accessTrust", player, true);
    }
  }
  
  player.sendMessage(`§aGranted ${targetPlayerName === "all" ? "the public" : targetPlayerName} permission to use buttons and levers in ${c?.id ? "this claim." : "all your claims."}`)
  db.store("land", lands);
  return {
    status: 0
  }
})