import blessed from 'blessed';

export default class ComponentsBuilder {
  #screen
  #layout
  #input
  #chat
  #status
  #activityLogs
  constructor() { };

  #baseComponent() {
    return {
      border: 'line',
      mouse: true,
      keys: true,
      top: 0,
      scrollbar: {
        ch: '',
        inverse: true
      },
      //tags -> HABILITA COLOCAR CORES E TAGS NO TEXTO
      tags: true
    }
  }

  setScreen({ title }) {
    this.#screen = blessed.screen({
      smartCSR: true,
      title
    })
    this.#screen.key(['escape', 'q', 'C-c'], () => process.exit(0))
    return this
  }

  setLayoutComponent() {
    this.#layout = blessed.layout({
      parent: this.#screen,
      width: '100%',
      height: '100%'
    })
    return this
  }


  setInputComponent(onEnterPressed) {
    const input = blessed.textarea({
      parent: this.#screen,
      bottom: 0,
      height: '10%',
      inputOnFocus: true,
      padding: {
        top: 1,
        left: 2
      },
      style: {
        fg: '#F6F6F6',
        bg: '#353535'
      }
    })

    input.key('enter', onEnterPressed)

    this.#input = input;
    return this;
  }



  setChatComponent() {
    this.#chat = blessed.list({
      ...this.#baseComponent(),
      parent: this.#layout,
      align: 'left',
      width: '50%',
      height: '90%',
      items: ['{bold}Mensagens{/}']
    })

    return this
  }

  setStatusComponents() {
    this.#status = blessed.list({
      ...this.#baseComponent(),
      parent: this.#layout,
      width: '25%',
      height: '90%',
      items: ['{bold}Usuários na sala{/}']
    });

    return this;
  }

  setActivityLogs() {
    this.#activityLogs = blessed.list({
      ...this.#baseComponent(),
      parent: this.#layout,
      width: '25%',
      height: '90%',
      style: {
        fg: 'yellow'
      },
      items: ['{bold}Log de atividades.{/}']
    });

    return this;
  }

  build() {
    const components = {
      screen: this.#screen,
      input: this.#input,
      chat: this.#chat,
      status: this.#status,
      activityLog: this.#activityLogs
    }

    return components;
  }
}