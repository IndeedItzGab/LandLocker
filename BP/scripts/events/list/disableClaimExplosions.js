import { world, system} from "@minecraft/server"
import * as db from "../../utilities/storage.js"

world.afterEvents.playerLeave.subscribe((e) => {
  disableClaimExplosions(e.playerName)
})

system.beforeEvents.shutdown.subscribe(() => {
  world.getPlayers().forEach(player => {
    disableClaimExplosions(player.name)
  })
})

function disableClaimExplosions(playerName) {
  let lands = db.fetch("land", true)
  for(let land of lands.filter(data => data.owner === playerName.toLowerCase() && data?.setting?.allowExplosions)) {
    land.setting.allowExplosions = false
  }
  db.store("land", lands)
}