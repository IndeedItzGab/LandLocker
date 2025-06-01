import { world, system} from "@minecraft/server"
import { config } from "../../config.js"
import "../../utilities/checkLand.js"

globalThis.playerInClaim = () => {
  [...world.getPlayers()].forEach(player => {
    const land = checkLand(player)
    const isProtected = land?.owner ? config.LandLocker.PVP.ProtectPlayersInLandClaims.PlayerOwnedClaims : config.LandLocker.PVP.ProtectPlayersInLandClaims.AdministrativeClaims
    if(isProtected && land) {
      if(player.hasTag("safeCombat.inClaim")) return
      system.run(() => player.addTag("safeCombat.inClaim"))
    } else {
      system.run(() => player.removeTag("safeCombat.inClaim"))
    }
  })
}