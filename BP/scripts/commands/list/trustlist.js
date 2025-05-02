import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"
import "../../utilities/claimBlocks.js"
import "../../utilities/checkLand.js"
import "../../utilities/overlapCheck.js"
import "../../utilities/generateID.js"
import "../../utilities/getTopBlock.js"

const commandInformation = {
  name: "trustlist",
  description: "Lists the permissions for the claim you're standing in.",
  aliases: [],
  usage:[]
}

registerCommand(commandInformation, (origin) => {

  const player = origin.sourceEntity
  const c = checkLand(player)

  let lands = db.fetch("land", true) || []
  if(!c) return player.sendMessage("§cStand inside the claim you're curious about.")
  let land = lands.find(v => v?.id == c?.id)
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
  
  for(const member of land.members) {
    if(member.permissions.permissionTrust === true) {
       manage += `${member.name} `
    } else if(member.permissions.fullTrust === true) {
      build += `${member.name} `
    } else if(member.permissions.containerTrust === true) {
      containers += `${member.name} `
    } else if(member.permissions.accessTrust === true) {
      access += `${member.name} `
    }
  }
  
  player.sendMessage(`§bExplicit permissions here:
§6>${manage}
§e>${build}
§a>${containers}
§9>${access}
§6Manage §eBuild §aContainers §9Access`)
  return {
    status: 0
  }
})