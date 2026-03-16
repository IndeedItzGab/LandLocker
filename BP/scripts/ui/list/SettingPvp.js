import { ModalFormData } from "@minecraft/server-ui"
import * as db from "../../utilities/DatabaseHandler.js"

export function SettingPvp(player) {
  let setting = db.fetch("landlocker:setting")
  let pvp = setting.pvp
  const form = new ModalFormData()
  .title("§l§eCombat")
  .label("This section is about combat configuration")
  .textField("Combat Timeout", `${pvp["combatTimeoutSeconds"]}`)
  .toggle("Protect Players in basic claims", {defaultValue: pvp.protectPlayersInLandClaims["playerOwnedClaims"]})
  .toggle("Protect Players in admin claims", {defaultValue: pvp.protectPlayersInLandClaims["administrativeClaims"]})
  .submitButton("Confirm")

  form.show(player).then(res => {
    if(res.canceled) return;

    // Value Validation
    if(isNaN(res.formValues[1])) {
      return player.sendMessage(`§cYour changed was not saved because of an invalid value.`)
    }
    
    setting = {
      ...setting,
      pvp: {
        ...setting.pvp,
        combatTimeoutSeconds: parseInt(res.formValues[1]) || parseInt(pvp["combatTimeoutSeconds"]),
        protectPlayersInLandClaims: {
          playerOwnedClaims: res.formValues[2],
          administrativeClaims: res.formValues[3]
        }
      }
    }
    player.sendMessage(`§aYour changes have been saved.`)
    db.store("landlocker:setting", setting)
  })
}