import { system } from "@minecraft/server"
import "./list/VisualizationEvent.js"
import "./list/AccrueClaimBlocksEvent.js"

// One Second Interval
system.runInterval(() => {
  VisualizationEvent()
}, 1*20)

// Five Minutes Interval
system.runInterval(() => {
  AccrueClaimBlocksEvent()
}, 5*60*20)