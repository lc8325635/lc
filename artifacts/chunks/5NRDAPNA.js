import {
  ObjectSelector,
  client_exports,
  dom_exports,
  globalEnv,
  html,
  preact_exports,
  stores_exports,
  styles_exports
} from "./QZ2KTKGS.js";

// js/applets/ai-chat/AiModelSelector.js
var AiModelSelector = class extends preact_exports.Component {
  #modelStore;
  constructor(props) {
    super(props);
    this.#modelStore = props.store;
    this.state = {
      models: []
    };
  }
  componentDidMount() {
    const models = globalEnv.ai.models.listAllModels();
    this.setState({ models });
    this.#modelStore.setValue(models[0]);
  }
  componentWillUnmount() {
  }
  render() {
    return html`
            <${ObjectSelector} options=${this.state.models} store=${this.#modelStore} />
        `;
  }
};

// js/applets/ai-chat/AiChat.js
var AiChat = class extends preact_exports.Component {
  #chat;
  #user;
  #modelStore;
  #assistant;
  #thoughtInputRef;
  #contentFrameRef;
  constructor(props) {
    super(props);
    const ai = globalEnv.ai;
    this.#chat = ai.createChat();
    this.#user = ai.users.getUser("User");
    this.#assistant = ai.users.getUser("Assistant");
    this.#modelStore = stores_exports.PrimitiveStore.of();
    this.state = {
      messages: this.#chat.getMessages()
    };
  }
  componentDidMount() {
    this.#chat.listenerMap.add("onMessage", this.#onMessage);
    this.#chat.listenerMap.add("onUpdate", this.#onUpdate);
  }
  componentWillUnmount() {
    this.#chat.listenerMap.remove("onUpdate", this.#onUpdate);
    this.#chat.listenerMap.remove("onMessage", this.#onMessage);
  }
  #onUpdate = async (event2) => {
    const thought = event2.thought ?? "";
    const start = Math.max(0, thought.length - 80);
    this.#thoughtInputRef.value = thought.slice(start);
  };
  #onMessage = async (event2) => {
    this.setState({ messages: this.#chat.getMessages() });
    dom_exports.scrollToBottom(this.#contentFrameRef);
  };
  async userSay(text) {
    await this.#chat.say(event.target.value, this.#user);
    const model = this.#modelStore.getValue();
    await this.#chat.askModel(model, this.#assistant);
  }
  /*****************************************************************
   ** Render code                                                 **
   *****************************************************************/
  render() {
    styles_exports.loadCss({ path: `js/applets/ai-chat/ai-chat.css`, content: `.ai-chat {
    display: flex;
    flex-flow: column nowrap;
    height: 16rem;

    & div.content {
        overflow-x: hidden;
        overflow-y: scroll;
        flex-grow: 1;
    }

    div.username {
        color: var(--pico-primary);
    }

    div.date {
        text-align: right;
        color: var(--pico-secondary);
    }

    div.speech {
        whitespace: pre-wrap;
    }

    & textarea {
        background: white;
        color: black;
        margin: 0;
        border: 0;
        padding: 0;
        resize: none;
        height: 4rem;
    }
}
` });
    const messageElements = this.state.messages.map((message, index) => {
      if (message.isSystemMessage()) return null;
      const dateText = client_exports.locale.dateString(message.timestamp);
      return html`
                <article key=${index} class="message">
                    <hgroup role="group">
                        <div class="username">${message.user.toString()}</div>
                        <div class="date">${dateText}</div>
                    </hgroup>
                    <div class="speech">${message.content}</div>
                </article>
            `;
    });
    const onKeyDown = (event2) => {
      if (event2.key === "Enter" && !event2.shiftKey) {
        this.userSay(event2.target.value);
        event2.target.value = "";
        event2.preventDefault();
      }
    };
    const setThoughtInputRef = (node) => this.#thoughtInputRef = node;
    const setContentFrameRef = (node) => this.#contentFrameRef = node;
    return html`
            <article class="pico ai-chat container">
                <${AiModelSelector} store=${this.#modelStore} />
                <div class="content" ref=${setContentFrameRef}>
                    ${messageElements}
                </div>
                <input ref=${setThoughtInputRef} type="text" disabled=${true} />
                <textarea onKeyDown=${onKeyDown}></textarea>
            </article>
        `;
  }
};

export {
  AiChat
};
