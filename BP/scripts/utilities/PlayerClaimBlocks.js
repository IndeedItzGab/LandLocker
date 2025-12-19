import { world } from "@minecraft/server";
import * as db from "./DatabaseHandler.js";

globalThis.claimBlocks = (player, landId = null) => {
  const playerStatus = db.fetch("landPlayersList", true).find(data => data?.name.toLowerCase() === player.name.toLowerCase())
  const claimBlocks = playerStatus?.claimBlocks?.play + playerStatus?.claimBlocks?.bonus
  let claimedLandBlocks = 0;
  for(const land of db.fetch("land", true).filter(data => data.owner?.toLowerCase() === player.name.toLowerCase())) {
    if(!land.owner || land.id === landId) continue;
    claimedLandBlocks += (Math.abs(land.bounds.rx - land.bounds.lx) + 1) * (Math.abs(land.bounds.rz - land.bounds.lz) + 1)
  }
  return claimBlocks - claimedLandBlocks
}
