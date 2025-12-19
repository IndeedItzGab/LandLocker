import { world } from "@minecraft/server"
import { messages } from "../../messages.js"

world.afterEvents.chatSend.subscribe((event) => {
  const player = event.sender
  const message = event.message
  if(messages.TrappedChatKeyword.split(';').some(d => message.toLowerCase().includes(d.toLowerCase()))) {
    player.sendMessage(`§b${messages.TrappedInstructions}`)
  }
})