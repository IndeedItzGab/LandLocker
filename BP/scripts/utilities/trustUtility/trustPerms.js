import * as db from "../storage.js"


globalThis.updatePermissions = (land, targetName, type, player, isAllLands) => {
  const existingMember = land.members.find(m => m.name === targetName);
  const ownerPermissions = land.members.find(v => v.name.toLowerCase() === land.owner?.toLowerCase())

  if(targetName.toLowerCase() === "all") {
    switch(type) {
      case "fullTrust":
        land.publicPermissions.fullTrust = true
        land.publicPermissions.accessTrust = false
        land.publicPermissions.containerTrust = false
        break;
      case "accessTrust":
        land.publicPermissions.fullTrust = false
        land.publicPermissions.accessTrust = true
        land.publicPermissions.containerTrust = false
        break;
      case "containerTrust":
        land.publicPermissions.fullTrust = false
        land.publicPermissions.accessTrust = false
        land.publicPermissions.containerTrust = true
        break;
      case "permissionTrust":
        land.publicPermissions.permissionTrust = true
        break;
    }
  } else {
    if(existingMember) {
      switch(type) {
        case "fullTrust":
          existingMember.permissions.fullTrust = true
          existingMember.permissions.accessTrust = false
          existingMember.permissions.containerTrust = false
          break;
        case "accessTrust":
          existingMember.permissions.fullTrust = false
          existingMember.permissions.accessTrust = true
          existingMember.permissions.containerTrust = false
          break;
        case "containerTrust":
          existingMember.permissions.fullTrust = false
          existingMember.permissions.accessTrust = false
          existingMember.permissions.containerTrust = true
        case "permissionTrust":
          existingMember.permissions.permissionTrust = true
          break;
      }
    } else {
      const permissions = {
        fullTrust: false,
        accessTrust: false,
        containerTrust: false,
        permissionTrust: false
      }
        
      switch(type) {
        case "fullTrust":
          permissions.fullTrust = true
          break;
        case "accessTrust":
          permissions.accessTrust = true
          break;
        case "containerTrust":
          permissions.containerTrust = true
          break;
        case "permissionTrust":
          permissions.permissionTrust = true
          break
      }
        
      const json = {
        name: targetName.toLowerCase(),
        permissions
      };
      land?.members.push(json)
    }
  }
}

globalThis.updatePermissions = updatePermissions;