import { world, system, MolangVariableMap } from "@minecraft/server"
import * as db from "../../utilities/DatabaseHandler.js" 
import "../../utilities/FetchTopBlock.js"
import "../../utilities/Visualization.js"

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

let show = new Map();

world.afterEvents.playerHotbarSelectedSlotChange.subscribe((event) => {
  const player = event.player
  const dimension = player.dimension
  const lands = db.fetch("land", true)
  const setting = db.fetch("landlocker:setting")
  const adminClaim = lands.filter(data => data.owner === null && !data.owner && player.isAdmin())
  const claim = lands.filter(data => data.owner?.toLowerCase() === player.name.toLowerCase()).concat(adminClaim)

  if(event.itemStack?.typeId === setting.claims["modificationTool"]) {
    // Process all locations of particles per lands borders
    for(const data of claim) {
      const secondaryBorder = !data.owner ? {red: 1, green: 0.6, blue: 0} : {red: 1, green: 1, blue: 0}
      const corners = visualization({red: 1, green: 1, blue: 1}, secondaryBorder, data)

      let particleData = []
      for(const sub of data.subdivisions) {
        const subCorners = visualization({red: 1, green: 1, blue: 1}, {red: 0.5, green: 0.5, blue: 0.5}, sub)
        for(const pos of subCorners) {
          try {
            particleData.push({
              player: player.name,
              x: pos.x,
              y: pos.y,
              z: pos.z,
              color: JSON.parse(pos.color)
            })
          } catch (err) {}
        }
      }
      for(const pos of corners) {
        try {
          particleData.push({
            owner: player.name,
            x: pos.x,
            y: pos.y,
            z: pos.z,
            color: JSON.parse(pos.color)
          })
        } catch (err) {}
      }
      globalThis.particleData = globalThis.particleData.concat(particleData)
    }

    // Start showing with interval per second
    show.set(player.name, system.runInterval(() => {
      for(const data of globalThis.particleData) {
        const molangVars = new MolangVariableMap();
        molangVars.setFloat("variable.emitter_lifetime", 1);
        molangVars.setColorRGB("variable.color", {red: data.color.red, green: data.color.green, blue: data.color.blue});

        if(data.color.red === 1 && data.color.green === 1 && data.color.blue === 1) {
          for (let x = 0.0; x < 1.01; x += 0.5) {
            for (let y = 0.0; y < 1.01; y += 0.5) {
              for (let z = 0.0; z < 1.01; z += 0.5) {
                try {
                  dimension.spawnParticle("minecraft:wax_particle", {
                    x: data.x + x,
                    y: data.y + y,
                    z: data.z + z
                  },
                  molangVars);
                } catch (err) {}
              }
            }
          }
        } else {
          for (let x = 0.0; x < 1.01; x += 1) {
            for (let y = 0.0; y < 1.01; y += 1) {
              for (let z = 0.0; z < 1.01; z += 1) {
                try {
                  dimension.spawnParticle("minecraft:wax_particle", {
                    x: data.x + x,
                    y: data.y + y,
                    z: data.z + z
                  },
                  molangVars);
                } catch (err) {}
              }
            }
          }
        }
      }
    }, 20))
  } else {
    const interval = show.get(player.name)
    if(interval) {
      system.clearRun(interval)
    }

    const editingLand = player.getTags()?.find(tag => tag.startsWith("editingLand:"))
    const isEditingSub = player.getTags()?.find(tag => tag.startsWith("isEdtingSub:"))
    const shovelClaim = player.getTags()?.find(tag => tag.startsWith("shovelClaim:"))
    const shovelMode = player.getTags()?.find(tag => tag.startsWith("shovelMode:"))
    shovelMode ? player.removeTag(shovelMode) : null;
    shovelClaim ? player.removeTag(shovelClaim) : null;
    editingLand ? player.removeTag(editingLand) : null;
    isEditingSub ? player.removeTag(isEditingSub) : null;

    globalThis.particleData = globalThis.particleData.filter(d => d.owner !== player.name);
  }
})