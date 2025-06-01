import { world, system } from "@minecraft/server"
import * as db from "../../utilities/storage.js"

globalThis.combatChecker = () => {
  [...world.getPlayers()].forEach(player => {
    try {
      let combatData = db.fetch("landLocker:combatData", true)
      let playerCombatData = combatData.find(d => d.name === player.name)
      if(!playerCombatData || playerCombatData?.time >= system.currentTick) return;
      
      player.removeTag("inCombat")
      combatData = combatData.filter(d => d.name !== player.anme)
      db.store("landLocker:combatData", combatData)
    } catch (error) {
      console.error(error)
    }
  })
}