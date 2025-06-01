import { world, Player, system } from "@minecraft/server"
import { messages } from "../../messages.js"
import { config } from "../../config.js"
import * as db from "../../utilities/storage.js"
const CombatTimeoutSeconds = config.LandLocker.PVP.CombatTimeoutSeconds

world.afterEvents.entityHitEntity.subscribe((event) => {
  if(!(event.hitEntity instanceof Player || event.damagingEntity instanceof Player)) return
  
  try {
    
    if(!event.damagingEntity.hasTag("inCombat")) {
      if(event.damagingEntity.hasTag("safeCombat.inClaim")) {
        return event.damagingEntity.sendMessage(`§c${messages.CantFightWhileImmune}`)
      }
      if(event.damagingEntity.hasTag("safeCombat.emptyInventory")) {
        return event.damagingEntity.sendMessage(`§c${messages.CantFightWhileImmune}`)
      }
    }
    
    if(!event.hitEntity.hasTag("inCombat")) {
      if(event.hitEntity.hasTag("safeCombat.inClaim")) {
        return event.damagingEntity.sendMessage(`§c${messages.PlayerInPvPSafeZone}`)
      }
      if(event.hitEntity.hasTag("safeCombat.emptyInventory")) {
        return event.damagingEntity.sendMessage(`§c${messages.ThatPlayerPvPImmune}`)
      }
    }
    
    let combatData = db.fetch("landLocker:combatData", true)
    const victimData = combatData.find(d => d.name === event.hitEntity.name)
    const suspectData = combatData.find(d => d.name === event.damagingEntity.name)
    
    !victimData ? 
      combatData.push({ name: event.hitEntity.name, time: system.currentTick + (CombatTimeoutSeconds*20)}) :
      victimData.time = system.currentTick + (CombatTimeoutSeconds*20)

    !suspectData ?
      combatData.push({ name: event.damagingEntity.name, time: system.currentTick + (CombatTimeoutSeconds*20)}) :
      suspectData.time = system.currentTick + (CombatTimeoutSeconds*20)

    event.hitEntity.addTag("inCombat")
    event.damagingEntity.addTag("inCombat")
    db.store("landLocker:combatData", combatData)
  } catch (error) {
    console.error(error)
  } 
})