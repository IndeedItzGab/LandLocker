import "./utilities/prototype/handler.js"
import "./commands/handler.js"
import "./events/handler.js"
import "./live/handler.js"

import {system, world } from "@minecraft/server"
system.beforeEvents.watchdogTerminate.subscribe((beforeWatchdogTerminate) => {
	beforeWatchdogTerminate.cancel = true;
	world.sendMessage(`§r[§dRealm§r] §f${new Date()} |§4 A Watchdog Exception has been detected and has been cancelled successfully. Reason: §c${beforeWatchdogTerminate.terminateReason}`);
});

console.info(`LandLocker has started.`)