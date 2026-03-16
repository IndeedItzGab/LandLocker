import { ActionFormData } from "@minecraft/server-ui"
import { ui } from "../Handler.js"

export function SettingMain(player) {
  const settingUi = new ActionFormData()
  .title(`§l§eLandLocker's Setting`)
  .body(`§bVersion:§r 1.1.5\n§bDeveloper: §r@IndeedItzGab\nConfigurable setting for operators to tweak or make changes to match their preferences.`)
  .button("Commands", "textures/blocks/command_block_side_mipmap.png")
  .button("Claims", "textures/ui/icon_recipe_nature.png")
  .button("Combat", "textures/ui/icon_recipe_equipment.png")

  settingUi.show(player).then(res => {
    if(res.cancelled) return;
    switch(res.selection) {
      case 0:
        // Commands
        ui.SettingCommands(player);
        break;
      case 1:
        // Claims
        ui.SettingClaims(player);
        break;
      case 2:
        // Combat/Pvp
        ui.SettingPvp(player);
        break;
    }
  })
}