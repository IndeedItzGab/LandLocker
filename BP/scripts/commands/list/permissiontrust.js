import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"
import "../../utilities/checkLand.js"
import "../../utilities/trustUtility/trustPerms.js"
import { messages } from "../../messages.js"

const commandInformation = {
  name: "permissiontrust",
  description: "Grants a player permission to share his permission level with others.",
  aliases: ["pt"],
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
  const isAdmin = player.isOp() // CODE_ORANGE
  const c = checkLand(player)
  const isOwner = c.owner?.toLowerCase() === player.name.toLowerCase() || (!c.owner && isAdmin)
  let lands = db.fetch("land", true)
  
  if(isOwner && !c) return player.sendMessage(`§c${messages.GrantPermissionNoClaim}`)
  if(targetPlayerName !== "all" && (!db.fetch("landPlayersList", true).some(data => data.name.toLowerCase() === targetPlayerName.toLowerCase()))) return player.sendMessage(`§c${messages.PlayerNotFound2}`)
  
  
  if (c?.id) {
    let land = lands.find(v => v?.id === c?.id);
    land.members = land.members || [];
    
    if(!isOwner) {
      const playerLandData = land.members.find(v => v.name.toLowerCase() === player.name.toLowerCase() && land.owner?.toLowerCase() !== player.name.toLowerCase())
      if(playerLandData?.permissions?.permissionTrust === false || !playerLandData) return player.sendMessage(`§c${messages.NoPermissionTrust.replace("{0}", land.owner)}`);
      return player.sendMessage(`§c${messages.CantGrantThatPermission}`)
    }

    updatePermissions(land, targetPlayerName.toLowerCase(), "permissionTrust", player, false);
    lands = lands.map(l => l.id === land.id ? land : l);
  } else {
   for (let land of lands.filtrr(data => data.owner === player.name.toLowerCase())) {
      land.members = land.members || [];
      updatePermissions(land, targetPlayerName.toLowerCase(), "permissionTrust", player, true);
    }
  }
  
  const who = targetPlayerName === "all" ? messages.CollectivePublic : targetPlayerName
  const permissionType = messages.PermissionsPermission
  const where = c?.id ? messages.LocationCurrentClaim : messages.LocationAllClaims
  player.sendMessage(`§a${messages.GrantPermissionConfirmation.replace("{0}", who).replace("{1}", permissionType).replace("{2}", where)}`)
  db.store("land", lands);
  return {
    status: 0
  }
})