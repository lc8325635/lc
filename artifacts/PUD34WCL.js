import "./chunks/P5XVWO7G.js";
import {
  AiChat
} from "./chunks/5NRDAPNA.js";
import {
  DialogLayer,
  DialogModel,
  DialogWindow,
  html,
  preact_exports
} from "./chunks/QZ2KTKGS.js";
import "./chunks/U4FYQBOV.js";

// js/applets/global-menu/GlobalMenu.js
var GlobalMenu = class extends preact_exports.Component {
  #dialogModel = new DialogModel();
  #menuItems = [];
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.#addMenuItem("AI chat", this.#activateAiChat);
    this.#addMenuItem("Preferences", this.#activatePreferences);
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  #addMenuItem(name, callback) {
    const onClick = (event) => {
      callback.call(this);
      this.setState({ isOpen: false });
    };
    this.#menuItems.push({ name, onClick });
  }
  #onToggleMenu = (event) => {
    this.setState({ isOpen: !this.state.isOpen });
  };
  #activateAiChat = async (event) => {
    await this.#dialogModel.open("ai-chat");
  };
  #activatePreferences = (event) => {
  };
  #renderMenu() {
    const elements = this.#menuItems.map((item) => html`
            <li><button class="menu-item" onClick=${item.onClick}>
                ${item.name}
            </button></li>
        `);
    return html`<ul class="drop-down">${elements}</ul>`;
  }
  render() {
    return html`
            <div class="title-bar">
                <button
                    id="toggle-button"
                    onClick=${this.#onToggleMenu}>☰</button>
            </div>
            ${this.state.isOpen ? this.#renderMenu() : null}
            <${DialogLayer} model=${this.#dialogModel}>
                <${DialogWindow} name="ai-chat" title="AI Chat" buttons="OK">
                    <${AiChat} />
                <//>
            <//>
        `;
  }
};

// js/applets/global-menu/entrypoint.js
var entrypoint_default = GlobalMenu;
export {
  entrypoint_default as default
};
