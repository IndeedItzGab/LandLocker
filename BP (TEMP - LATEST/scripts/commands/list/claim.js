import { registerCommand }  from "../CommandRegistry.js"
import * as db from "../../utilities/DatabaseHandler.js"
import { messages } from "../../messages.js"
import { config } from "../../config.js"
import "../../utilities/PlayerClaimBlocks.js"
import "../../utilities/LandValidation.js"
import "../../utilities/OverlapLandValidation.js"
import "../../utilities/RandomIDGenerator.js"

const commandInformation = {
  name: "claim",
  description: "Creates a land claim centered at your current location.",
  aliases: [],
  usage:[
    {
      name: "radius",
      type: "Integer",
      optional: true
    }
  ]
}

registerCommand(commandInformation, (origin, radius = config.LandLocker.Claims.AutomaticNewPlayerClaimsRadius) => {
  
  const player = origin.sourceEntity
  const c = checkLand(player)
  const isOwner = c?.owner?.toLowerCase() === player.name.toLowerCase()
  const leftX = Math.round(player.location.x - radius);
  const rightX = Math.round(player.location.x + radius);
  const leftZ = Math.round(player.location.z - radius);
  const rightZ = Math.round(player.location.z + radius);
  const permutationClaimBlocks = claimBlocks(player) - (Math.abs(rightX - leftX) + 1) * (Math.abs(rightZ- leftZ) + 1)
  let l = db.fetch('land', true)
  
  if(permutationClaimBlocks < 0) return player.sendMessage(`§c${messages.CreateClaimInsufficientBlocks.replace("{0}", Math.abs(permutationClaimBlocks))}`)
  if(isOwner) return player.sendMessage(`§c${messages.CreateClaimFailOverlap}`)
  if(overlapCheck(player, leftX, rightX, leftZ, rightZ) || c) return player.sendMessage(`§c${messages.CreateClaimFailOverlapShort}`)

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
    members: [],
    subdivisions: [],
    version: "1.0.7"
  }
  
  l.push(data)
  db.store("land", l)
  player.sendMessage(`§a${messages.CreateClaimSuccess}`)

  return {
    status: 0
  }
})