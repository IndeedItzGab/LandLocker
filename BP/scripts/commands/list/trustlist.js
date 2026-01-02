import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"
import { messages } from "../../messages.js"
import "../../utilities/claimBlocks.js"
import "../../utilities/checkLand.js"
import "../../utilities/overlapCheck.js"
import "../../utilities/generateID.js"
import "../../utilities/getTopBlock.js"
import "../../utilities/checkSubLand.js"

const commandInformation = {
  name: "trustlist",
  description: "Lists the permissions for the claim you're standing in.",
  aliases: [],
  usage:[]
}

registerCommand(commandInformation, (origin) => {

  const player = origin.sourceEntity
  const c = checkLand(player)
  const s = checkSubLand(player)

  let lands = db.fetch("land", true) || []
  if(!c) return player.sendMessage(`§c${messages.TrustListNoClaim}`)
  
  let land;
  if(s) {
    land = s.data
  } else {
    land = lands.find(d => d?.id === c?.id)
  }
  
  let manage = "", build = "", containers = "", access = ""
  
  if(land.publicPermissions.permissionTrust === true) {
    manage += "public "
  } else if(land.publicPermissions.fullTrust === true) {
    build += "public "
  } else if(land.publicPermissions.containerTrust === true) {
    containers += "public "
  } else if(land.publicPermissions.accessTrust === true) {
    access += "public "
  }
  
  manage += land.members.filter(d => d.permissions.permissionTrust).map(m => m.name).join(" ")
  build += land.members.filter(d => d.permissions.fullTrust).map(m => m.name).join(" ")
  containers += land.members.filter(d => d.permissions.containerTrust).map(m => m.name).join(" ")
  access += land.members.filter(d => d.permissions.accessTrust).map(m => m.name).join(" ")
  
  player.sendMessage(`§b${messages.TrustListHeader}
§6>${manage}
§e>${build}
§a>${containers}
§9>${access}
§6${messages.Manage} §e${messages.Build} §a${messages.Containers} §9${messages.Access}`)
  return {
    status: 0
  }
})