globalThid.untrustPermission = (land, targetName, player, isAllLands) => {
  if(targetName.toLowerCase() === "all" || targetName.toLowerCase() === "public") {
    land.publicPermissions.fullTrust = false
    land.publicPermissions.accessTrust = false
    land.publicPermissions.containerTrust = false
    land.publicPermissions.permissionTrust = false
    land.members = []
  } else {
    land.members = land.members.filter(v => v?.name.toLowerCase() !== targetName.toLowerCase())
  }
}