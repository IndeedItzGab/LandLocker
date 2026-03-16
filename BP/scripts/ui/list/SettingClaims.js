import { ModalFormData } from "@minecraft/server-ui"
import * as db from "../../utilities/DatabaseHandler.js"

export function SettingClaims(player) {
  let setting = db.fetch("landlocker:setting")
  let claims = setting.claims
  const form = new ModalFormData()
  .title("§l§eClaims")
  .label("This section is about land claims configurations.")
  .toggle("Protect Creatures", {defaultValue: claims["protectCreatures"]})
  .toggle("Ender pearl required Access Trust", {defaultValue: claims["enderPearlsRequireAccessTrust"]})
  .textField("Initial Blocks", `${claims["initialBlocks"]}`)
  .textField("Claim blocks per hour", `${claims["claimBlocksAccruedPerHour"]}`)
  .textField("Accrued idle threshold", `${claims["accruedIdleThreshold"]}`)
  .textField("Maximum accrued claim blocks", `${claims["maxAccruedClaimBlocks"]}`)
  .textField("Default claim radius", `${claims["automaticNewPlayerClaimsRadius"]}`)
  .textField("Minimum claim size", `${claims["minSize"]}`)
  .textField("Minimum claim wide", `${claims["minWide"]}`)
  .textField("Investigation Tool", `${claims["investigationTool"]}`)
  .textField("Modification Tool", `${claims["modificationTool"]}`)
  .submitButton("Confirm")

  form.show(player).then(res => {
    if(res.canceled) return;

    // Value Validation
    if(isNaN(res.formValues[3]) ||
      isNaN(res.formValues[4]) ||
      isNaN(res.formValues[5]) ||
      isNaN(res.formValues[6]) ||
      isNaN(res.formValues[7]) ||
      isNaN(res.formValues[8]) ||
      isNaN(res.formValues[9])) {
      return player.sendMessage(`§cYour changed was not saved because of an invalid value.`)
    }

    setting = {
      ...setting,
      claims: {
        ...setting.claims,
        protectCreatures: res.formValues[1],
        enderPearlsRequireAccessTrust: res.formValues[2],
        initialBlocks: parseInt(res.formValues[3]) || parseInt(claims["initialBlocks"]),
        claimBlocksAccruedPerHour: parseInt(res.formValues[4]) || parseInt(claims["claimBlocksAccruedPerHour"]),
        accruedIdleThreshold: parseInt(res.formValues[5]) || parseInt(claims["accruedIdleThreshold"]),
        maxAccruedClaimBlocks: parseInt(res.formValues[6]) || parseInt(claims["maxAccruedClaimBlocks"]),
        automaticNewPlayerClaimsRadius: parseInt(res.formValues[7]) || parseInt(claims["automaticNewPlayerClaimsRadius"]),
        minSize: parseInt(res.formValues[8]) || parseInt(claims["minSize"]),
        minWide: parseInt(res.formValues[9])|| parseInt(claims["minWide"]),
        investigationTool: res.formValues[10] || claims["investigationTool"],
        modificationTool: res.formValues[11] || claims["modificationTool"],
      },
    }
    player.sendMessage(`§aYour changes have been saved.`)
    db.store("landlocker:setting", setting)
  })
}