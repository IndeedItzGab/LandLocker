import { world, Player, system } from "@minecraft/server"
import { messages } from "../../messages.js"
import { config } from "../../config.js"
import * as db from "../../utilities/DatabaseHandler.js"
const CombatTimeoutSeconds = config.LandLocker.PVP.CombatTimeoutSeconds

world.beforeEvents.entityHurt.subscribe((event) => {
  if(event.damageSource.damagingEntity?.typeId !== "minecraft:player" || event.hurtEntity?.typeId !== "minecraft:player") return
  const attacker = event.damageSource.damagingEntity
  const victim = event.hurtEntity

  let combatData = db.fetch("landLocker:combatData", true)
  const victimData = combatData.find(d => d.name === event.hurtEntity.name)
  const suspectData = combatData.find(d => d.name === event.damageSource.damagingEntity.name)

  try {
    if(suspectData?.time <= system.currentTick || !suspectData) {
      // Check if attacker is in a protected land claim
      const land = checkLand(attacker)
      const isProtected = land?.owner ? config.LandLocker.PVP.ProtectPlayersInLandClaims.PlayerOwnedClaims : config.LandLocker.PVP.ProtectPlayersInLandClaims.AdministrativeClaims
      if(isProtected && land) {
        event.cancel = true;
        return attacker.sendMessage(`§c${messages.CantFightWhileImmune}`)
      }

      // Check if attacker has an empty inventory
      const inv = attacker.getComponent("inventory").container
      if(inv.size === inv.emptySlotsCount) {
        event.cancel = true;
        return attacker.sendMessage(`§c${messages.CantFightWhileImmune}`)
      }
    }
    
    if(victimData?.time <= system.currentTick || !victimData) {
      // Check if victim is in a protected land claim
      const land = checkLand(victim)
      const isProtected = land?.owner ? config.LandLocker.PVP.ProtectPlayersInLandClaims.PlayerOwnedClaims : config.LandLocker.PVP.ProtectPlayersInLandClaims.AdministrativeClaims
      if(isProtected && land) {
        event.cancel = true;
        return attacker.sendMessage(`§c${messages.PlayerInPvPSafeZone}`)
      }

      // Check if victim has an empty inventory
      const inv = victim.getComponent("inventory").container
      if(inv.size === inv.emptySlotsCount) {
        event.cancel = true;
        return attacker.sendMessage(`§c${messages.ThatPlayerPvPImmune}`)
      }
    }
    
    !victimData ? 
      combatData.push({ name: event.hurtEntity.name, time: system.currentTick + (CombatTimeoutSeconds*20)}) :
      victimData.time = system.currentTick + (CombatTimeoutSeconds*20)

    !suspectData ?
      combatData.push({ name: event.damageSource.damagingEntity.name, time: system.currentTick + (CombatTimeoutSeconds*20)}) :
      suspectData.time = system.currentTick + (CombatTimeoutSeconds*20)

    db.store("landLocker:combatData", combatData)
  } catch (error) {
    console.error(error)
  } 
})