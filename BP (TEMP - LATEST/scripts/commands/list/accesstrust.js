import { registerCommand }  from "../CommandRegistry.js"
import * as db from "../../utilities/DatabaseHandler.js"
import "../../utilities/LandValidation.js"
import "../../utilities/SubLandValidation.js"
import "../../utilities/trustUtility/TrustPermissionHandler.js"
import { messages } from "../../messages.js"


const commandInformation = {
  name: "accesstrust",
  description: "Gives a player permission to use your buttons, levers, and beds.",
  aliases: ["at"],
  usage:[
    {
      name: "player",
      type: "String",
      optional: false
    }
  ]
}


registerCommand(commandInformation, (origin, targetPlayerName) => {

  const player = origin.sourceEntity
  const isAdmin = player.playerPermissionLevel === 2 // CODE_ORANGE
  const c = checkLand(player)
  const s = checkSubLand(player)
  const isOwner = c?.owner?.toLowerCase() === player.name.toLowerCase() || (!c?.owner && isAdmin)
  let lands = db.fetch("land", true)
  
  if(isOwner && !c) return player.sendMessage(`§c${messages.GrantPermissionNoClaim}`)
  if(!["all", "public"].includes(targetPlayerName.toLowerCase()) && (!db.fetch("landPlayersList", true).some(data => data.name.toLowerCase() === targetPlayerName.toLowerCase()))) return player.sendMessage(`§c${messages.PlayerNotFound2}`)

  if (c?.id) {
    let land = lands.find(v => v?.id === c?.id);
    land.members = land.members || [];
    
    if(!isOwner && (!isAdmin || !player.hasTag("landlocker:ignoringClaims"))) {
      const playerLandData = land.members.find(v => v.name.toLowerCase() === player.name.toLowerCase() && land.owner?.toLowerCase() !== player.name.toLowerCase())
      if(playerLandData?.permissions?.permissionTrust === false || !playerLandData) return player.sendMessage(`§c${messages.NoPermissionTrust.replace("{0}", land.owner)}`);
      if(!playerLandData?.permissions?.accessTrust) return player.sendMessage(`§c${messages.CantGrantThatPermission}`)
    }

    if(s) {
      // UNFINISHED
      let sub = land.subdivisions.find(d => (
        s.data.bounds.lx === d.bounds.lx &&
        s.data.bounds.rx === d.bounds.rx &&
        s.data.bounds.lz === d.bounds.lz &&
        s.data.bounds.rz === d.bounds.rz
      ))
      updatePermissions(sub, targetPlayerName.toLowerCase(), "fullTrust", player, false);
    } else {
      updatePermissions(land, targetPlayerName.toLowerCase(), "fullTrust", player, false);
    }
    lands = lands.map(l => l.id === land.id ? land : l);
  } else {
   for (let land of lands.filtrr(data => data.owner === player.name.toLowerCase())) {
      land.members = land.members || [];
      updatePermissions(land, targetPlayerName.toLowerCase(), "accessTrust", player, true);
    }
  }
  
  const who = ["all", "public"].includes(targetPlayerName.toLowerCase()) ? messages.CollectivePublic : targetPlayerName
  const permissionType = messages.AccessPermission
  const where = c?.id ? messages.LocationCurrentClaim : messages.LocationAllClaims
  player.sendMessage(`§a${messages.GrantPermissionConfirmation.replace("{0}", who).replace("{1}", permissionType).replace("{2}", where)}`)
  db.store("land", lands);
  return {
    status: 0
  }
})