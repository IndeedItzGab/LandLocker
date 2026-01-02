import { world, system } from "@minecraft/server";
import * as db from "./storage.js";
import "./visualization.js"

globalThis.overlapSubCheck = (player, lx = null, rx = null, lz = null, rz = null, land, subIndex) => {

  const lands = db.fetch("land", true)
  for(const [index, data] of lands.find(d => land === d.id).subdivisions.entries()) {
    if(index === subIndex) continue;
    if(
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