import ComponentsBuilder from "./components.js";
import { constants } from "./constants.js";

export default class TerminalController {
  #usersCollors = new Map();
  constructor() { }

  #pickColor() {
    return `#${((1 << 24) * Math.random() | 0).toString(16)}-fg`;
  }

  #getUserCollors(userName) {
    if (this.#usersCollors.has(userName)) { return this.#usersCollors.get(userName); }

    const collor = this.#pickColor();
    this.#usersCollors.set(userName, collor);

    return collor;
  }

  #onInputReceived(eventEmitter) {
    return function () {
      const message = this.getValue();
      console.log(message)
      this.clearValue()
    }
  }

  #onMessageReceved({ screen, chat }) {
    return msg => {
      const { userName, message } = msg;
      const collor = this.#getUserCollors(userName);
      chat.addItem(`{${collor}}{bold}${userName}{/}: ${message}`);
      screen.render();
    }
  }

  #onLogChange({ screen, activityLog }) {
    return msg => {
      const [userName] = msg.split(/\s/);
      const collor = this.#getUserCollors(userName);

      activityLog.addItem(`{${collor}}{bold}${msg.toString()}{/}`);

      screen.render();
    }
  }

  #onStatusChange({ screen, status }) {
    return users => {
      //Pegar o primeiro elemento da lista
      const { content } = status.items.shift();
      status.clearItems();
      status.addItem(content);
      users.forEach(userName => {
        const collor = this.#getUserCollors(userName);
        status.addItem(`{${collor}}{bold}${userName}{/}`);
      });
      screen.render();
    }
  }

  #registerEvents(eventEmitter, components) {
    eventEmitter.on(constants.events.app.MESSAGE_RECEIVED, this.#onMessageReceved(components));
    eventEmitter.on(constants.events.app.ACTIVITY_LOG_UPDATED, this.#onLogChange(components));
    eventEmitter.on(constants.events.app.STATUS_UPDATED, this.#onStatusChange(components));
  }

  async initializeTable(eventEmitter) {
    const components = new ComponentsBuilder()
      .setScreen({ title: 'HackerChat - Bruno P.' })
      .setLayoutComponent()
      .setInputComponent(this.#onInputReceived(eventEmitter))
      .setChatComponent()
      .setStatusComponents()
      .setActivityLogs()
      .build()

    this.#registerEvents(eventEmitter, components);
    components.input.focus();
    components.screen.render();

    setInterval(() => {
      eventEmitter.emit(constants.events.app.MESSAGE_RECEIVED, { message: 'Olá', userName: 'Bruno' });
      eventEmitter.emit(constants.events.app.MESSAGE_RECEIVED, { message: 'Oiee', userName: 'Maria P.' });
      eventEmitter.emit(constants.events.app.MESSAGE_RECEIVED, { message: 'Vou trabalhar', userName: 'Loro' });

      eventEmitter.emit(constants.events.app.ACTIVITY_LOG_UPDATED, 'Bruno left');
      eventEmitter.emit(constants.events.app.ACTIVITY_LOG_UPDATED, 'Maria P. left');
      eventEmitter.emit(constants.events.app.ACTIVITY_LOG_UPDATED, 'Loro join');

      const users = ['Bruno'];
      eventEmitter.emit(constants.events.app.STATUS_UPDATED, users);
      users.push('Maria P.');
      eventEmitter.emit(constants.events.app.STATUS_UPDATED, users);
      users.push('Loro', 'Vinicius');
      eventEmitter.emit(constants.events.app.STATUS_UPDATED, users);
    }, 2000)
  }
}