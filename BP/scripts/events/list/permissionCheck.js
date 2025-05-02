import { world } from "@minecraft/server"
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
  let blockEntity = data.block || data.target;
  const land = checkLand(blockEntity);
  if(!land) return;
  if(land.owner.toLowerCase() === player.name.toLowerCase()) return;
  
  const permissions = land.members.find(v => v.name.toLowerCase() === player.name.toLowerCase())?.permissions;
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
        player.sendMessage(`§cYou don't have ${land.owner}'s permission to use that.`)
      } else {
        if((accessTrust || publicPermissions.accessTrust) && ["cart", "boat"].some(v => blockEntity.typeId.includes(v))) return;
        player.sendMessage(`§cThat belongs to ${land.owner}.`)
      }
      data.cancel = true;
      break;
    case "break":
      if((containerTrust || publicPermissions.containerTrust) && (blockEntity.hasTag("minecraft:crop") || ["minecraft:pumpkin_stem", "minecraft:melon_stem"].some(v => blockEntity.typeId.includes(v)))) return;
      data.cancel = true
      player.sendMessage(`§cYou don't have ${land.owner}'s permission to build here.`)
      break;
    case "place":
      blockEntity = data.permutationBeingPlaced
      if((containerTrust || publicPermissions.containerTrust) && (blockEntity.hasTag("minecraft:crop") || ["minecraft:pumpkin_stem", "minecraft:melon_stem"].some(v => blockEntity.type.id.includes(v)))) return;
      data.cancel = true
      player.sendMessage(`§cYou don't have ${land.owner}'s permission to build here.`)
  }
}