import { world, system, MolangVariableMap } from "@minecraft/server"
import * as db from "../../utilities/storage.js" 
import "../../utilities/getTopBlock.js"
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
    
    if(heldItem?.typeId === config.LandLocker.Claims.ModificationTool) {
      dimension.getEntities().forEach(entity => {
        if(entity.getTags().some(tag => tag === `landlocker:${player.id}`)) {
          const blockX = Math.floor(entity.location.x);
          const blockY = Math.floor(entity.location.y);
          const blockZ = Math.floor(entity.location.z);

          const molangVars = new MolangVariableMap();
          const color = JSON.parse(entity.getTags().find(tag => tag.startsWith("landlocker:border:")).slice("landlocker:border:".length).replace(":primary", ''))
          molangVars.setFloat("variable.emitter_lifetime", 1000);
          molangVars.setFloat("variable.emittor_size", 200.0);
          molangVars.setColorRGB("variable.color", {red: color.red, green: color.green, blue: color.blue});

          if(entity.getTags().some(tag => tag.endsWith(":primary") && tag.startsWith("landlocker:border:"))) {
            for (let x = 0.0; x < 1.01; x += 0.5) {
              for (let y = 0.0; y < 1.01; y += 0.5) {
                for (let z = 0.0; z < 1.01; z += 0.5) {
                  dimension.spawnParticle("minecraft:wax_particle", {
                    x: blockX + x,
                    y: blockY + y,
                    z: blockZ + z
                  },
                  molangVars);
                }
              }
            }
          } else {
            for (let x = 0.0; x < 1.01; x += 1) {
              for (let y = 0.0; y < 1.01; y += 1) {
                for (let z = 0.0; z < 1.01; z += 1) {
                  dimension.spawnParticle("minecraft:wax_particle", {
                    x: blockX + x,
                    y: blockY + y,
                    z: blockZ + z
                  },
                  molangVars);
                }
              }
            }
          }
        }
      })

      if(player.hasTag("landlocker:showing")) return;
      player.addTag("landlocker:showing")

     
        

      for(const data of land) {
        const secondaryBorder = !data.owner ? {red: 1, green: 0.6, blue: 0} : {red: 1, green: 1, blue: 0}
        const corners = visualization({red: 1, green: 1, blue: 1}, secondaryBorder, data)
        // Orange {red: 1, green: 0.6, blue: 0}
        // Red {red: 1, green: 0, blue: 0}
        // Yellow {red: 1, green: 1, blue: 0}
        // Green {red: 0, green: 1, blue: 0}
        // Blue {red: 0, green: 0, blue: 1}
        // Purple {red: 0.6, green: 0, blue: 1}
        // Violet {red: 1, green: 0, blue: 1}
        // Sky Blue {red: 0, green: 0.6, blue: 1}
        // Cyan {red: 0, green: 1, blue: 1}
        // Pink {red: 1, green: 0, blue: 0.6}
        // White {red: 1, green: 1, blue: 1}
        // Black {red: 0, green: 0, blue: 0}
        // Gray {red: 0.5, green: 0.5, blue: 0.5}
        for(const sub of data.subdivisions) {
          const subCorners = visualization({red: 1, green: 1, blue: 1}, {red: 0.5, green: 0.5, blue: 0.5}, sub)
          for(const pos of subCorners) {
            const entity = dimension.spawnEntity("landlocker:border", {x: pos.x + 0.5, y: pos.y, z: pos.z + 0.5})
            entity?.addTag(`landlocker:${player.id}`)
            if(JSON.parse(pos.color).red === 1 && JSON.parse(pos.color).green === 1 && JSON.parse(pos.color).blue === 1) {
            entity?.addTag(`landlocker:border:${pos.color}:primary`)
            } else {
              entity?.addTag(`landlocker:border:${pos.color}`)
            }
            entity?.addEffect("minecraft:slowness", 99999, {amplifier: 255, showParticles: false})
            entity?.addEffect("minecraft:invisibility", 99999, {amplifier: 255, showParticles: false})
          }
        }
        for(const pos of corners) {
          const entity = dimension.spawnEntity("landlocker:border", {x: pos.x + 0.5, y: pos.y, z: pos.z + 0.5})
          entity?.addTag(`landlocker:${player.id}`)
          if(JSON.parse(pos.color).red === 1 && JSON.parse(pos.color).green === 1 && JSON.parse(pos.color).blue === 1) {
            entity?.addTag(`landlocker:border:${pos.color}:primary`)
          } else {
            entity?.addTag(`landlocker:border:${pos.color}`)
          }
          entity?.addEffect("minecraft:slowness", 99999, {amplifier: 255, showParticles: false})
          entity?.addEffect("minecraft:invisibility", 99999, {amplifier: 255, showParticles: false})
        }
      }
    } else {
      // This codes run if the player don't hold golden shovel
      const editingLand = player.getTags()?.find(tag => tag.startsWith("editingLand:"))
      const isEditingSub = player.getTags()?.find(tag => tag.startsWith("isEdtingSub:"))
      const shovelClaim = player.getTags()?.find(tag => tag.startsWith("shovelClaim:"))
      const shovelMode = player.getTags()?.find(tag => tag.startsWith("shovelMode:"))
      shovelMode ? player.removeTag(shovelMode) : null;
      shovelClaim ? player.removeTag(shovelClaim) : null;
      editingLand ? player.removeTag(editingLand) : null;
      isEditingSub ? player.removeTag(isEditingSub) : null;

      // Responsible for removing the custom entity borders
      if(player.hasTag("landlocker:showing")) {
        player.removeTag("landlocker:showing")
        world.getDimension("minecraft:overworld").getEntities().forEach(entity => {
          if(entity.getTags().some(tag => tag === `landlocker:${player.id}`)) {
            entity?.remove()
          }
        })
      }



    }
  })
}