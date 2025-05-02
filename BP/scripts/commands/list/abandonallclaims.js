import {
  world,
  system
} from "@minecraft/server";
import { registerCommand }  from "../commandRegistry.js"
import * as db from "../../utilities/storage.js"
import "../../utilities/claimBlocks.js"

const commandInformation = {
  name: "abandonallclaims",
  description: "Deletes all of your claims.",
  aliases: [],
  usage:[
    {
      name: "args",
      type: 3,
      optional: true
    }
  ]
}

registerCommand(commandInformation, (origin, args) => {
  

  const player = origin.sourceEntity

  if(player.hasTag("deleteAllLandQuery") && args === "confirm") {
    system.run(() => {
      player.removeTag(`deleteAllLandQuery`)
      db.store("land", db.fetch("land", true).filter(data => data.owner !== player.name.toLowerCase()));
      player.sendMessage(`§aClaims abandoned.  You now have ${claimBlocks(player)} available claim blocks.`)
    })
  } else {
    system.run(() => {
      player.addTag(`deleteAllLandQuery`)
      player.sendMessage(`§cAre you sure you want to abandon ALL of your claims? Please confirm with /abandonallclaims confirm`)
    })
  }
  
  return {
    status: 0
  }
})