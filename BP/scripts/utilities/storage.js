import { world, system } from "@minecraft/server"

export function store(objective, value) {
  system.run(() => {
    if (world.scoreboard.getObjective(objective)) world.scoreboard.removeObjective(objective);
    world.scoreboard.addObjective(objective, JSON.stringify(value));
  });
}

export function fetch(objective, asArray = false) {
  if(!world.scoreboard.getObjective(objective)) return asArray ? [] : null
  const data = JSON.parse(`${world.scoreboard.getObjective(objective).displayName}`)
  if(asArray) return Array.isArray(data) ? data : [];
  return data || {}
}