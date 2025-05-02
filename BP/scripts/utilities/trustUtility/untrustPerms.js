globalThid.untrustPermission = (land, targetName, player, isAllLands) => {
  if(targetName.toLowerCase() === "all") {
    land.publicPermissions.fullTrust = false
    land.publicPermissions.accessTrust = false
    land.publicPermissions.containerTrust = false
    land.publicPermissions.permissionTrust = false
    land.members = []
    if(untrustRepeatMessage && isAllLands) player.sendMessage(`§aCleared permissions in ALL your claims.  To set permissions for a single claim, stand inside it.`)
    if(untrustRepeatMessage && !isAllLands) player.sendMessage(`§aCleared permissions in this claim.  To set permission for ALL your claims, stand outside them.`)
  } else {
    land.members = land.members.filter(v => v?.name.toLowerCase() !== targetName.toLowerCase())
    if(untrustRepeatMessage && isAllLands) player.sendMessage(`§aRevoke ${targetName}'s access to ALL your claims.  To set permissions for a single claim, stand inside it.`)
    if(untrustRepeatMessage && !isAllLands) player.sendMessage(`§aRevoke ${targetName}'s access to this claim.  To set permisisons for ALL your claims, stand outside them.`)
  }
}