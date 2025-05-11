import { world } from "@minecraft/server"
import { messages } from "../../messages.js"
import "../../utilities/checkLand.js"

world.beforeEvents.playerBreakBlock.subscribe((e) => {
  permissionCheck(e, "break")
})

world.beforeEvents.playerPlaceBlock.subscribe((e) => {
  permissionCheck(e, "place")
})

world.beforeEvents.playerInteractWithBlock.subscribe((e) => {
  permissionCheck(e, "interact")
})

world.beforeEvents.playerInteractWithEntity.subscribe((e) => {
  permissionCheck(e, "interact")
})

// This handle the process for checking if player can/can't do a certain event.
function permissionCheck(data, eventType) {
  const player = data.player;
  const isAdmin = player.isOp() // CODE_ORANGE
  const blockEntity = data.block || data.target;
  const land = checkLand(blockEntity);
  
  if(!land ||
  land.owner?.toLowerCase() === player.name.toLowerCase() ||
  (land.adminClaim && isAdmin) ||
  (player.hasTag("landlocker:ignoringClaims") && isAdmin)) return;
  
  const permissions = land.members.find(v => v.name.toLowerCase() === player.name.toLowerCase())?.permissions;
  const ownerName = land.adminClaim ? messages.OwnerNameForAdminClaims : land.owner
  const publicPermissions = land.publicPermissions
  const accessTrust = permissions?.accessTrust || false
  const containerTrust = permissions?.containerTrust || false
  const fullTrust = permissions?.fullTrust || false
  if(fullTrust || publicPermissions.fullTrust) return;
  
  switch(eventType) {
    case "interact":
      if(containerTrust || publicPermissions.containerTrust) return;
      if(data.block) {
        if((accessTrust || publicPermissions.accessTrust) && ["button", "lever", "bed", "door", "cart", "boat", "crafting_table", "smithing_table"].some(v => blockEntity.typeId.includes(v))) return;
        player.sendMessage(`§c${messages.NoAccessPermission.replace("{0}", ownerName)}`)
      } else {
        if((accessTrust || publicPermissions.accessTrust) && ["cart", "boat"].some(v => blockEntity.typeId.includes(v))) return;
        player.sendMessage(`§c${messages.NotYourPet.replace("{0}", ownerName)}`)
      }
      data.cancel = true;
      break;
    case "break":
      if((containerTrust || publicPermissions.containerTrust) && (blockEntity.hasTag("minecraft:crop") || ["minecraft:pumpkin_stem", "minecraft:melon_stem"].some(v => blockEntity.typeId.includes(v)))) return;
      data.cancel = true
      player.sendMessage(`§c${messages.NoBuildPermission.replace("{0}", ownerName)}`)
      break;
    case "place":
      blockEntity = data.permutationBeingPlaced
      if((containerTrust || publicPermissions.containerTrust) && (blockEntity.hasTag("minecraft:crop") || ["minecraft:pumpkin_stem", "minecraft:melon_stem"].some(v => blockEntity.type.id.includes(v)))) return;
      data.cancel = true
      player.sendMessage(`§c${messages.NoBuildPermission.replace("{0}", ownerName)}`)
  }
}