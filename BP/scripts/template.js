import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../../commandRegistry.js"
import * as db from "../../../utilities/storage.js"
import "../../../utilities/claimBlocks.js"
import "../../../utilities/checkLand.js"
import "../../../utilities/overlapCheck.js"
import "../../../utilities/generateID.js"
import "../../../utilities/getTopBlock.js"

const commandInformation = {
  name: "templace",
  description: "description",
  aliases: [],
  usage:[
    {
      name: "test"
      type: 0,
      optional: false
    }
  ]
}

registerCommand(commandInformation, (origin, args1) => {
  
  if(origin.sourceBlock || origin.initiator || origin.sourceEntity.typeId !== "minecraft:player") return { status: 1 }
  
  const player = origin.sourceEntity
  const c = checkLand(player)
  const isOwner = c?.owner.toLowerCase() === player.name.toLowerCase()

  return {
    status: 0
  }
})