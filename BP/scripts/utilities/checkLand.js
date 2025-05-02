import { world } from "@minecraft/server";
import * as db from "./storage.js";

globalThis.checkLand = (player) => {
  for(const data of Array.isArray(db.fetch("land")) ? db.fetch("land") : [db.fetch("land")]) {
    if (
      data &&
      player.location.x >= data.bounds.lx &&
      player.location.x <= data.bounds.rx &&
      player.location.z >= data.bounds.lz &&
      player.location.z <= data.bounds.rz
    ) {
      return data;
    }
  }
  return null;
}