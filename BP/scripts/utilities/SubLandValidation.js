import { world } from "@minecraft/server"
import * as db from "./DatabaseHandler.js"

globalThis.checkSubLand = (target) => {
  for(const data of db.fetch("land", true)) {
    // Early iteration skip to avoid further checking (might improves performances)
    if(data.subdivisions.length === 0) continue;
    for(const sub of data.subdivisions) {
      if(sub &&
      Math.round(target.location.x) >= sub.bounds.lx &&
      Math.round(target.location.x) <= sub.bounds.rx &&
      Math.round(target.location.z) >= sub.bounds.lz &&
      Math.round(target.location.z) <= sub.bounds.rz &&
      target.dimension.id === data.world) {
        return {data: sub, parent: data.id}; // Return the data of subdivision claim 
      }
    }
  }
  return null;
}