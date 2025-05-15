import { Player, system, world } from "@minecraft/server"
import { config } from "../../../config.js"

Player.prototype.isAdmin = function () {
  return this.getTags().some(tag => tag.toLowerCase() === "admin")
};