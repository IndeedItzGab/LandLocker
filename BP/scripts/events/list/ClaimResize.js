import { world, system } from "@minecraft/server"
import * as db from "../../utilities/DatabaseHandler.js" 
import { messages } from "../../messages.js"
import { config } from "../../config.js"
import "../../utilities/LandValidation.js"
import "../../utilities/PlayerClaimBlocks.js"
import "../../utilities/FetchTopBlock.js"
import "../../utilities/Visualization.js"
import "../../utilities/OverlapLandValidation.js"
import "../../utilities/SubLandValidation.js"
import "../../utilities/OverlapSubLandValidation.js"

world.beforeEvents.playerBreakBlock.subscribe((e) => resize(e))
world.beforeEvents.playerInteractWithBlock.subscribe((e) => {
  if(e.isFirstEvent) resize(e)
})

function resize(event) {
  const player = event.player
  const block = event.block
  const isAdmin = player.playerPermissionLevel === 2
  const editData = player.getTags().find(v => v.startsWith("editingLand:"))
  const editSubData = player.getTags().find(v => v.startsWith("isEditingSub:"))
  const usedItem = player?.getComponent("inventory")?.container?.getItem(player?.selectedSlotIndex)
  if(usedItem?.typeId !== config.LandLocker.Claims.ModificationTool) return;
  
  let lands = db.fetch("land", true)
  
  // Responsible for declaring which subdivision claim will be adjusted
  if(!editSubData) {
    for(const land of lands) {
      for(const [index, subdivision] of land.subdivisions.entries()) {
        const x = block?.location.x === subdivision.bounds.lx ? true : block?.location.x === subdivision.bounds.rx ? false : null;
        const z = block?.location.z === subdivision.bounds.lz ? true : block?.location.z === subdivision.bounds.rz ? false : null;
        if(x === null || z === null) continue;
        event.cancel = true;
        system.run(() => {
          editSubData ? player.removeTag(editSubData) : null;
          player.addTag(`isEditingSub:${land.id}:${index}:${x}:${z}`)
        });
        player.sendMessage(`§e${messages.ResizeStart}`);
        return
      }
    }
  }
  
  // Declare which side will get adjust

  let test = [];
  for(const data of lands) {
    const isOwner = data.owner?.toLowerCase() === player.name.toLowerCase();
    if (!isOwner || (!data.owner && !isAdmin)) continue;
    
    if(editSubData && data.id === editSubData.split(':')[1]) {
      let test2 = {}
      data.subdivisions.forEach((sub, index) => {
        if(index === Number(editSubData.split(':')[2])) {
          event.cancel = true
          test2 = {data: sub, index: index}
        }
      })
      if(test2?.data) {
        const editSubDataArray = editSubData.split(':')
        system.run(() => player.removeTag(editSubData))
        newSize(test2.data, block, `doNotRemoveThis:${editSubDataArray[1]}:${editSubDataArray[3]}:${editSubDataArray[4]}`)
        
        if(!checkLand(block) || (!checkLand(block).owner && !isAdmin) || (checkLand(block).owner !== player.name.toLowerCase())) return player.sendMessage(`§c${messages.DeleteClaimMissing}`) // Unsure message
        if(overlapSubCheck(player, test2.data.bounds.lx, test2.data.bounds.rx, test2.data.bounds.lz, test2.data.bounds.rz, data.id, test2.index)) return player.sendMessage(`§c${messages.CreateSubdivisionOverlap}`)
  
        player.sendMessage(`§a${messages.ClaimResizeSuccess.replace("{0}", claimBlocks(player))}`)
  
        updateCache(player, lands)
      }
    } else {
      if(data?.id === editData?.split(':')[1]) {
        newSize(data, block, editData)
      
        system.run(() => {
          player.removeTag(editData);
        })
      
        // Check if the player have enough claim blocks.
        const permutationClaimBlocks = claimBlocks(player, data.id) - (Math.abs(data.bounds.rx - data.bounds.lx) + 1) * (Math.abs(data.bounds.rz - data.bounds.lz) + 1)
        if(permutationClaimBlocks < 0 && data.owner) return player.sendMessage(`§c${messages.ResizeNeedMoreBlocks.replace("{0}", Math.abs(permutationClaimBlocks))}`)
        
        // If it overlaps with other claim then it stop updating the land size.
        const overlap = overlapCheck(player, data.bounds.lx, data.bounds.rx, data.bounds.lz, data.bounds.rz, data.id)
        if(overlap) return player.sendMessage(`§c${messages.ResizeFailOverlap}`) 

        // If it a subdivision went outside the land then stop updating the land size.
        for(const sub of data.subdivisions) {
          if(
            data.bounds.lx > sub.bounds.lx ||
            data.bounds.rx < sub.bounds.rx ||
            data.bounds.lz > sub.bounds.lz ||
            data.bounds.rz < sub.bounds.rz
          ) {
            
            return player.sendMessage(`§c${messages.ResizeFailWentOutside}`)
          }
        }

      
        updateCache(player, lands)

        player.sendMessage(`§e${messages.ClaimResizeSuccess.replace("{0}", !data.owner ? 0 : claimBlocks(player))}`)
        test = !data.owner ? "admin" : player.name.toLowerCase()
        break; // Return to make it won't declare another side to be adjusted.
      } else {
        const x = block?.location.x === data.bounds.lx ? true : block?.location.x === data.bounds.rx ? false : null;
        const z = block?.location.z === data.bounds.lz ? true : block?.location.z === data.bounds.rz ? false : null;
        if(x === null || z === null) continue;
        event.cancel = true;
        system.run(() => {
          player.addTag(`editingLand:${data.id}:${x}:${z}`);
        })
        player.sendMessage(`§e${messages.ResizeStart}`);
        if(!editData) return
      }
    }
  }
  
  db.store("land", lands)
}

function updateCache(player, lands) {
  let particleData = []
  for(const data of lands) {
    for(const sub of data.subdivisions) {
      const subCorners = visualization({red: 1, green: 1, blue: 1}, {red: 0.3, green: 0.3, blue: 0.3}, sub)
      for(const pos of subCorners) {
        particleData.push({
          owner: player.name,
          x: pos.x,
          y: pos.y,
          z: pos.z,
          color: JSON.parse(pos.color)
        })
      }
    }

    for(const land of lands) {
      if(land.owner !== player.name.toLowerCase()) continue; // Avoid visualizing other players claim causing fps drops
      const secondaryBorder = !land.owner ? {red: 1, green: 0.6, blue: 0} : {red: 1, green: 1, blue: 0}
      const corners = visualization({red: 1, green: 1, blue: 1}, secondaryBorder, data)
      for(const pos of corners) {
        particleData.push({
          owner: player.name,
          x: pos.x,
          y: pos.y,
          z: pos.z,
          color: JSON.parse(pos.color)
        })
      }
    }
  }
  globalThis.particleData = particleData;
}

function newSize(data, block, firstCorner) {
  if(data.bounds.rx <= block.location.x && firstCorner.split(':')[2] === "true") {
    data.bounds.lx = data.bounds.rx;
    data.bounds.rx = block.location.x;
  } else if(data.bounds.lx >= block.location.x && firstCorner.split(':')[2] === "false") {
    data.bounds.rx = data.bounds.lx;
    data.bounds.lx = block.location.x;
  } else if(firstCorner.split(':')[2] === "true") {
    data.bounds.lx = block.location.x;
  } else if(firstCorner.split(':')[2] === "false") {
    data.bounds.rx = block.location.x
  }

  if(data.bounds.rz <= block.location.z && firstCorner.split(':')[3] === "true") {
    data.bounds.lz = data.bounds.rz;
    data.bounds.rz = block.location.z;
  } else if(data.bounds.lz >= block.location.z && firstCorner.split(':')[3] === "false") {
    data.bounds.rz = data.bounds.lz;
    data.bounds.lz = block.location.z;
  } else if(firstCorner.split(':')[3] === "true") {
    data.bounds.lz = block.location.z;
  } else if(firstCorner.split(':')[3] === "false") {
    data.bounds.rz = block.location.z
  }
}