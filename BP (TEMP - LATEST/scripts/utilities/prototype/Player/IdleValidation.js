import { Player, system, world } from "@minecraft/server"
import { config } from "../../../config.js"
/**
 * @return {boolean} true if the player is idling, false otherwise
 */
 
const idleTracker = new Map();
const idleThreshold = config.LandLocker.Claims.Accrued_Idle_Threshold*20;

system.runInterval(() => {
  for (const player of world.getPlayers()) {
    const id = player.id;
    const pos = player.location;

    const prev = idleTracker.get(id);
    if (!prev) {
      idleTracker.set(id, { pos, ticks: 0 });
      continue;
    }

    const samePos =
      Math.floor(pos.x) === Math.floor(prev.pos.x) &&
      Math.floor(pos.y) === Math.floor(prev.pos.y) &&
      Math.floor(pos.z) === Math.floor(prev.pos.z);

    const newTicks = samePos ? prev.ticks + 1 : 0;
    idleTracker.set(id, { pos, ticks: newTicks });
  }
}, 1);


Player.prototype.isIdle = function () {
  const tracked = idleTracker.get(this.id);
  return tracked ? tracked.ticks >= idleThreshold : false;
};