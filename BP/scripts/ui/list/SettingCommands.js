import { ModalFormData } from "@minecraft/server-ui"
import * as db from "../../utilities/DatabaseHandler.js"

export function SettingCommands(player) {
  let setting = db.fetch("landlocker:setting")
  let commands = setting.commands
  const form = new ModalFormData()
  .title("§l§eCommands")
  .label("This section is about slash commands configurations.")
  .textField("Cooldown", `${commands["cooldown"]}`)
  .submitButton("Confirm")

  form.show(player).then(res => {
    if(res.canceled) return;

    // Value Validation
    if(isNaN(res.formValues[1])) {
      return player.sendMessage(`§cYour changed was not saved because of an invalid value.`)
    }
    
    setting = {
      ...setting,
      commands: {
        ...setting.commands,
        cooldown: parseInt(res.formValues[1]) || parseInt(commands["cooldown"])
      }
    }
    player.sendMessage(`§aYour changes have been saved.`)
    db.store("landlocker:setting", setting)
  })
}