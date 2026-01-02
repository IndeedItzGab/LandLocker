import { world } from "@minecraft/server";
import * as db from "./DatabaseHandler.js";

globalThis.generateID = () => {
  let result = '';
  for (let i = 0; i < 20; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}