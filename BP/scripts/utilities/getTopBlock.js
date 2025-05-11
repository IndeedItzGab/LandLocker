import { world } from "@minecraft/server";
import * as db from "./storage.js";

globalThis.getTopBlock = (location) => {
  const dimension = world.getDimension("overworld")
  for (let y = 320; y >= -64; y--) {
    const block = dimension.getBlock({x: location.x, y: y, z: location.z});
    if ((block && block.isSolid) || block?.typeId.includes("landlocker:")) {
      return block.location.y
    }
  }
  return 0
}