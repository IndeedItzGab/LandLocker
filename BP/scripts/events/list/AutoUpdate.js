import { world, system } from "@minecraft/server"
import * as db from "../../utilities/DatabaseHandler.js"

system.run(() => {
  const lands = db.fetch("land", true)
  let setting = db.fetch("landlocker:setting")
  const version = db.fetch("landlocker:version")
  if(!version || version !== "1.1.4") {
    setting = {
      commands: {
        cooldown: setting?.commands?.cooldown || 20
      },
      claims: {
        protectCreatures: setting?.claims?.protectCreatures || true,
        enderPearlsRequireAccessTrust: setting?.claims?.enderPearlsRequireAccessTrust || true,
        initialBlocks: parseInt(setting?.claims?.initialBlocks) || 100,
        claimBlocksAccruedPerHour: parseInt(setting?.claims?.claimBlocksAccruedPerHour) || 100,
        accruedIdleThreshold: parseInt(setting?.claims?.accruedIdleThreshold) || 60,
        maxAccruedClaimBlocks: parseInt(setting?.claims?.maxAccruedClaimBlocks) || 80000,
        automaticNewPlayerClaimsRadius: parseInt(setting?.claims?.automaticNewPlayerClaimsRadius) || 4,
        minSize: parseInt(setting?.claims?.minSize) || 5,
        minWide: parseInt(setting?.claims?.minWide) || 5,
        investigationTool: setting?.claims?.investigationTool || "minecraft:stick",
        modificationTool: setting?.claims?.modificationTool || "minecraft:golden_shovel",
      },
      pvp: {
        combatTimeoutSeconds: parseInt(setting?.pvp?.combatTimeoutSeconds) || 15,
        allowCombatItemDrop: setting?.pvp?.allowCombatItemDrop || false, // *
        protectPlayersInLandClaims:{
          playerOwnedClaims: parseInt(setting?.pvp?.protectPlayersInLandClaims?.playerOwnedClaims) || true,
          administrativeClaims: parseInt(setting?.pvp?.protectPlayersInLandClaims?.administrativeClaims) || true
        }
      }
    }
    db.store("landlocker:setting", setting)
    db.store("landlocker:version", "1.1.4")
  }
})