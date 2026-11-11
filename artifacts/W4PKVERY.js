import {
  TextEditor
} from "./chunks/ODLH24VM.js";
import "./chunks/LVCZT5H5.js";
import {
  Button,
  TextArea,
  globalEnv,
  html,
  preact_exports,
  stores_exports,
  styles_exports
} from "./chunks/MU5EPMOO.js";
import "./chunks/U4FYQBOV.js";

// js/applets/slidegen/Slidegen.js
var Slidegen = class extends preact_exports.Component {
  #promptStore;
  #filepathStore;
  constructor(props) {
    super(props);
    this.#promptStore = stores_exports.PrimitiveStore.of("", "slidegen.txt");
    this.#filepathStore = stores_exports.PrimitiveStore.of();
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  #onPrompt = async (event) => {
    const prompt = this.#promptStore.getValue();
    console.info(prompt);
  };
  #onUpdate = async (event) => {
    const slideshow = globalEnv.mountIds["slideshow-1"];
    if (slideshow) {
      const content = await globalEnv.files.load("slides.html");
      slideshow.setContent(content);
    }
  };
  render() {
    styles_exports.loadCss({ path: `js/applets/slidegen/slidegen.css`, content: `.slidegen {
    textarea {
        margin: 0;
    }
}
` });
    const textFiles = ["slides.html"];
    return html`
            <div class="slidegen pico">
                <${TextEditor} text-files=${textFiles} filepathStore=${this.#filepathStore} />
                <${TextArea} store=${this.#promptStore} />
                <fieldset role="group">
                    <${Button} icon="cpu" class="secondary" name="Prompt" onClick=${this.#onPrompt} />
                    <${Button} icon="play-circle" class="secondary" name="Update" onClick=${this.#onUpdate} />
                </fieldset>
            </div>
        `;
  }
};

// js/applets/slidegen/entrypoint.js
var entrypoint_default = Slidegen;
export {
  entrypoint_default as default
};
