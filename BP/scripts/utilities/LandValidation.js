import { world } from "@minecraft/server";
import * as db from "./DatabaseHandler.js";

globalThis.checkLand = (player) => {
  for(const data of db.fetch("land", true)) {
    if (
      data &&
      Math.round(player?.location.x) >= data.bounds.lx &&
      Math.round(player?.location.x) <= data.bounds.rx &&
      Math.round(player?.location.z) >= data.bounds.lz &&
      Math.round(player?.location.z) <= data.bounds.rz &&
      player.dimension.id === data.world
    ) {
      return data;
    }
  }
  return null;
}