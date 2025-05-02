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

const commandInformation = {
  name: "claim",
  description: "Creates a land claim centered at your current location.",
  aliases: [],
  usage:[
    {
      name: "radius",
      type: 1,
      optional: true
    }
  ]
}

registerCommand(commandInformation, (origin, radius = 5) => {
  
  const player = origin.sourceEntity
  const c = checkLand(player)
  const isOwner = c?.owner.toLowerCase() === player.name.toLowerCase()
  const leftX = Math.round(player.location.x - radius);
  const rightX = Math.round(player.location.x + radius);
  const leftZ = Math.round(player.location.z - radius);
  const rightZ = Math.round(player.location.z + radius);
  const permutationClaimBlocks = claimBlocks(player) - (Math.abs(rightX - leftX) + 1) * (Math.abs(rightZ- leftZ) + 1)
  let l = db.fetch('land', true)
  
  if(permutationClaimBlocks < 0) return player.sendMessage(`§cYou don't have enough blocks to claim that entire area.  You need ${Math.abs(permutationClaimBlocks)} more blocks.`)
  if(isOwner) return player.sendMessage(`§cYou can't create a claim here because it would overlap your other claim. Use /abandonclaim to delete it, or use your shovel at a corner to resize it.`)
  if(overlapCheck(player, leftX, rightX, leftZ, rightZ) || c) return player.sendMessage(`§cYour selected area overlaps an existing claim.`)

  const data = {
    owner: player.name.toLowerCase(),
    id: generateID(),
    world: player.dimension.id,
    adminClaim: false,
    bounds: {
      lx: leftX,
      lz: leftZ,
      rx: rightX,
      rz: rightZ
    },
    setting: {
      allowExplosions: false
    },
    publicPermissions: {
      fullTrust: false,
      accessTrust: false,
      containerTrust: false,
      permissionTrust: false
    },
    members: []
  }
  
  l.push(data)
  db.store("land", l)
  player.sendMessage(`§aClaim created! Use !trust to share it with friends.`)

  return {
    status: 0
  }
})