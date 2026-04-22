import { ModalFormData } from "@minecraft/server-ui"
import * as db from "../../utilities/DatabaseHandler.js"

const toNum = (val, fallback) => {
  const n = parseInt(val);
  return isNaN(n) ? fallback : n;
};

export function SettingPvp(player) {
  let setting = db.fetch("landlocker:setting")
  let pvp = setting.pvp
  const form = new ModalFormData()
  .title("§l§eCombat")
  .label("This section is about combat configuration")
  .textField("§lCombat Timeout\n§r§iThis is used to avoid protecting players while they are in combat (per seconds).", `${pvp["combatTimeoutSeconds"]}`)
  .toggle("§lProtect Players in basic claims\n§r§iThis is used to protect players from all basic claims.", {defaultValue: pvp.protectPlayersInLandClaims["playerOwnedClaims"]})
  .toggle("§lProtect Players in admin claims\n§r§iThis is used to protect players from all admin claims.", {defaultValue: pvp.protectPlayersInLandClaims["administrativeClaims"]})
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
        combatTimeoutSeconds: toNum(res.formValues[1], pvp["combatTimeoutSeconds"]),
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