import { world, system } from "@minecraft/server"
import * as db from "../../utilities/storage.js" 
import "../../utilities/getTopBlock.js"
import "../../utilities/visualization.js"
import { messages } from "../../messages.js"

system.runInterval(() => {
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
      if(heldItem?.typeId === "minecraft:golden_shovel" ||
      (cache.split(':')[1] ==="admin" && world.getPlayers().some(d => (
        d.isAdmin() &&
        d.getComponent("inventory")?.container.getItem(d.selectedSlotIndex)?.typeId === "minecraft:golden_shovel"
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
    if(heldItem?.typeId === "minecraft:golden_shovel") {
      for(const data of land) {
        let cache = !data.owner ? adminCacheBlocks : playerCacheBlocks
        // Declaring all corners location
        const secondaryBlock = !data.owner ? "landlocker:admin_secondary_block" : "landlocker:basic_secondary_block"
        const corners = visualization("landlocker:basic_primary_block", secondaryBlock, data)
        
        let isCurrentlyOverlapState = db.fetch(`overlapCacheBlocks:${data.id}`, true)
        
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
      const adminTag = player.hasTag("shovelMode:adminClaims")
      
      // Remove admin mode
      if(adminTag) {
        system.run(() => {
          player.removeTag("shovelMode:adminClaims")
          player.sendMessage(`§b${messages.ShovelBasicClaimMode}`)
        })
      }
      
      // Remove edit data that is for resizing the claim
      if(editData) {
        system.run(() => {
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
}, 20)