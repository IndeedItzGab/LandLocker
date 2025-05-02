import { world } from "@minecraft/server"

world.beforeEvents.chatSend.subscribe((event) => {
  const player = event.sender
  let commandName;
  if(event.message.startsWith("!")) {
    commandName.slice(1).split(" ")[0]
    event.cancel = true
  }
  
  
  
})