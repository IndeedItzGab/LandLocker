import { system } from "@minecraft/server"
import "./list/show.js"
import "./list/deliverAccruedBlocks.js"
import "./list/combatChecker.js"
import "./list/playerInClaim.js"

// One Second Interval
system.runInterval(() => {
  show()
  combatChecker()
  playerInClaim()
}, 1*20)

// Five Minutes Interval
system.runInterval(() => {
  deliverAccruedBlocks()
}, 5*60*20)