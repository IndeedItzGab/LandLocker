import { world, system } from "@minecraft/server"
import * as db from "../../utilities/storage.js"

system.run(() => {
  const lands = db.fetch("land", true)

  if(lands.some(d => d.version !== "1.0.7")) {
    lands.forEach((land, index) => {
      if(land.version === "1.0.7") return;
      land.subdivisions = []
      land.version = "1.0.7"
    })
    db.store("land", lands)
  }
})