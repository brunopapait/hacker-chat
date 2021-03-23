import Events from 'events';
import TerminalController from "./src/terminalController.js";

const componentEmitter = new Events();
const terminalController = new TerminalController();

await terminalController.initializeTable(componentEmitter);