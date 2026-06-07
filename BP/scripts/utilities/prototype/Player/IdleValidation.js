import { Player, system, world } from "@minecraft/server"
import * as db from "../../DatabaseHandler.js"
/**
 * @return {boolean} true if the player is idling, false otherwise
 */
 
const idleTracker = new Map();

system.runInterval(() => {
  for (const player of world.getPlayers()) {
    const id = player.id;
    const pos = player.location;
    const view = player.getViewDirection()

    const prev = idleTracker.get(id);
    if (!prev) {
      idleTracker.set(id, { pos, ticks: 0 });
      continue;
    }

    const samePos =
      Math.floor(pos.x) === Math.floor(prev.pos?.x) &&
      Math.floor(pos.y) === Math.floor(prev.pos?.y) &&
      Math.floor(pos.z) === Math.floor(prev.pos?.z);
    
    const sameView =
      Math.floor(view.x) === Math.floor(prev.view?.x) &&
      Math.floor(view.y) === Math.floor(prev.view?.y) &&
      Math.floor(view.z) === Math.floor(prev.view?.z)


    const newTicks = samePos || sameView ? prev.ticks + 1 : 0;
    idleTracker.set(id, { pos, view, ticks: newTicks });
  }
}, 1);


Player.prototype.isIdle = function () {
  const setting = db.fetch("landlocker:setting")
  const idleThreshold = setting.claims["accruedIdleThreshold"]*20
  const tracked = idleTracker.get(this.id);
  return tracked ? tracked.ticks >= idleThreshold : false;
};