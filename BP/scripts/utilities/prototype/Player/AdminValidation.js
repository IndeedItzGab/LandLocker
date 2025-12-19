import { Player } from "@minecraft/server"

Player.prototype.isAdmin = function () {
  return this.playerPermissionLevel === 2
};