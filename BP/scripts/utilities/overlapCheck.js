import { world } from "@minecraft/server";
import * as db from "./storage.js";

globalThis.overlapCheck = (plauer, lx = null, rx = null, lz = null, rz = null, landID = null) => {
  lx = lx ? lx : player.location.x-5
  rx = rx ? rx : player.location.x+5
  lz = lz ? lz : player.location.z-5
  rz = rz ? rz : player.location.z+5
  for(const data of db.fetch("land", true)) {
    if(landID === data.id) continue;
    if (
      data &&
      data.bounds.lx <= rx &&
      data.bounds.rx >= lx &&
      data.bounds.lz <= rz &&
      data.bounds.rz >= lz
    ) {
      return data;
    }
  }
  return null;
}