import { world, system } from "@minecraft/server"
import * as db from "../../utilities/DatabaseHandler.js" 
import "../../utilities/FetchTopBlock.js"
import "../../utilities/visualization.js"
import { messages } from "../../messages.js"
import { config } from "../../config.js"

globalThis.show = () => {
  [...world.getPlayers()].forEach(player => {
    // Declaring Variables
    const inv = player.getComponent("inventory").container
    const heldItem = inv.getItem(player.selectedSlotIndex)
    const isAdmin = player.isAdmin() // CODE_ORANGE
    const lands = db.fetch("land", true)
    const adminClaim = lands.filter(data => data.owner === null && !data.owner && isAdmin)
    const land = lands.filter(data => data.owner?.toLowerCase() === player.name.toLowerCase()).concat(adminClaim)
    const dimension = player.dimension
    const allCacheBlocks = db.find(`landCacheBlocks:`)//world.scoreboard.getObjectives().filter(data => data.id.includes("landCacheBlocks:"))
    
    // Responsible for removing the edit blocks once the owner of the land no longer hold a golden shovel
    for(const cache of allCacheBlocks) {
      const cachePlayer = [...world.getPlayers()].find(data => data.name.toLowerCase() === cache.split(':')[1])
      const inv = cachePlayer?.getComponent("inventory")?.container
      const heldItem = inv?.getItem(cachePlayer?.selectedSlotIndex)
      if(heldItem?.typeId === config.LandLocker.Claims.ModificationTool ||
      (cache.split(':')[1] ==="admin" && world.getPlayers().some(d => (
        d.isAdmin() &&
        d.getComponent("inventory")?.container.getItem(d.selectedSlotIndex)?.typeId === config.LandLocker.Claims.ModificationTool
      )))) continue;
      let allPlayerCacheBlocks = db.fetch(cache, true)
      let blocksToBeRemoved = [];
      
      for(const cacheBlock of allPlayerCacheBlocks) {
        if(typeof cacheBlock?.originalBlock === "undefined") continue
        const block = dimension.getBlock({x: cacheBlock.location.x, y: cacheBlock.location.y, z: cacheBlock.location.z})
        block?.setType(cacheBlock.originalBlock)
          
        // Make sure that it is updated before removing the block from cache data
        const updatedBlock = block ? dimension.getBlock(block?.location) : null
        if(updatedBlock && updatedBlock?.typeId === cacheBlock?.originalBlock) {
          blocksToBeRemoved.push(cacheBlock)
        }
      }
      allPlayerCacheBlocks = allPlayerCacheBlocks.filter(data => !blocksToBeRemoved.includes(data))
      db.store(cache, allPlayerCacheBlocks)
    }
    
    let adminCacheBlocks = db.fetch(`landCacheBlocks:admin`, true)
    let playerCacheBlocks = db.fetch(`landCacheBlocks:${player.name.toLowerCase()}`, true)
    if(heldItem?.typeId === config.LandLocker.Claims.ModificationTool) {
      for(const data of land) {
        let cache = !data.owner ? adminCacheBlocks : playerCacheBlocks
        // Declaring all corners location
        const secondaryBlock = !data.owner ? "landlocker:admin_secondary_block" : "landlocker:basic_secondary_block"
        const corners = visualization("landlocker:basic_primary_block", secondaryBlock, data)
        
        let isCurrentlyOverlapState = db.fetch(`overlapCacheBlocks:${data.id}`, true)
        // Handle subdivision claim stuffs (mechanics are the same with the parent)
        for(const sub of data.subdivisions) {
          const subCorners = visualization("landlocker:subdivide_primary_block", "landlocker:subdivide_secondary_block", sub)
          for(const pos of subCorners) {
            const block = dimension.getBlock({x: pos.x, y: pos.y, z: pos.z})
            if(cache.some(d => d.location.x === pos.x && d.location.y === pos.y && d.location.z === pos.z)) continue;
            
            cache.push({
              owner: player.name.toLowerCase(),
              landId: data.id,
              originalBlock: block?.typeId,
              temporaryBlock: pos.type,
              location: { x: pos.x, y: pos.y, z: pos.z}
            })
            block?.setType(pos.type)
          }
        }
        
        // Handle replacing blocks at specified location
        for(const pos of corners) {
          const block = dimension.getBlock({x: pos.x, y: pos.y, z: pos.z})
          // Avoid outline blocks (aka edit blockd) to be permanently implemented to the world.
          if(cache.some(d => d.location.x === pos.x && d.location.y === pos.y && d.location.z === pos.z)) continue;
          
          // If the land's outline is currently in overlapping state that was trigger by someone/you then it will ignore the current block-
          // and get the original block from the overlap cache data
          let currentOverlapBlock = isCurrentlyOverlapState.find(d => d.location.x === pos.x && d.location.y === pos.y && d.location.z === pos.z)
          isCurrentlyOverlapState = isCurrentlyOverlapState.filter(d => !(d.location.x === pos.x && d.location.y === pos.y && d.location.z === pos.z))
          
          // Push the new cache data
          cache.push({
            owner: player.name.toLowerCase(),
            landId: data.id,
            originalBlock: currentOverlapBlock?.originalBlock || block?.typeId,
            temporaryBlock: pos.type,
            location: { x: pos.x, y: pos.y, z: pos.z}
          })
          block?.setType(pos.type)
        }
        db.store(`overlapCacheBlocks:${data.id}`, isCurrentlyOverlapState)
        db.store(`landCacheBlocks:${!data.owner ? "admin" : player.name.toLowerCase()}`, cache)
      }
    } else {
      // This codes run if the player don't hold golden shovel
      
      // Declaring variables
      const claimTag = player.getTags().find(d => d.includes("shovelClaim:"))
      const editData = player.getTags().find(v => v.startsWith("editingLand:"))
      const editSubData = player.getTags().find(v => v.startsWith("isEditingSub:"))
      const isAdminMode = player.hasTag("shovelMode:adminClaims")
      const isSubdivisionMode = player.hasTag("shovelMode:subdivisionClaims")
      
      // Remove admin mode or subdivision mode
      if(isAdminMode || isSubdivisionMode) {
        system.run(() => {
          player.removeTag("shovelMode:adminClaims")
          player.removeTag("shovelMode:subdivisionClaims")
          player.sendMessage(`§b${messages.ShovelBasicClaimMode}`)
        })
      }
      
      // Remove edit data that is for resizing the claim
      if(editData || editSubData) {
        system.run(() => {
          player.removeTag(editSubData)
          player.removeTag(editData)
        })
      };
      
      // Remove claim data that is for claiming a land vai golden shovel
      if(claimTag) {
        system.run(() => {
          player.removeTag(claimTag)
        })
        let shovelCacheBlock = db.fetch("shovelClaimCacheBlock", true).find(d => d.owner === player.name.toLowerCase())
        const block = world.getDimension(`${shovelCacheBlock?.world}`)?.getBlock({x: shovelCacheBlock.location.x, y: shovelCacheBlock.location.y, z: shovelCacheBlock.location.z})
        if(block) {
          system.run(() => {
            block?.setType(shovelCacheBlock?.originalBlock)
            shovelCacheBlock = db.fetch("shovelClaimCacheBlock", true).filter(d => !(d.location.x === shovelCacheBlock.location.x && d.location.y === shovelCacheBlock.location.y && d.location.z === shovelCacheBlock.location.z && d.owner === shovelCacheBlock.owner))
            db.store("shovelClaimCacheBlock", shovelCacheBlock)
          })
        }
      }
    }
  })
}