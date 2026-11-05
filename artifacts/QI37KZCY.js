import {
  TextEditor
} from "./chunks/V4DJNDUY.js";
import "./chunks/LVCZT5H5.js";
import {
  Button,
  globalEnv,
  html,
  preact_exports,
  stores_exports,
  styles_exports
} from "./chunks/IM4XGPPB.js";
import "./chunks/U4FYQBOV.js";

// js/applets/slidegen/Slidegen.js
var Slidegen = class extends preact_exports.Component {
  #filepathStore;
  constructor(props) {
    super(props);
    this.#filepathStore = stores_exports.PrimitiveStore.of();
    globalEnv.files.touch("slides.html");
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  #onUpdate = async (event) => {
    const slideshow = globalEnv.mountIds["slideshow-1"];
    if (slideshow) {
      const content = await globalEnv.files.load("slides.html");
      slideshow.setContent(content);
    }
  };
  render() {
    styles_exports.loadCss({ path: `js/applets/slidegen/slidegen.css`, content: `.slidegen {
    & .code-editor {
        & .toolbar {
            display: grid;
            grid-template-columns: 3fr 1fr 1fr 1fr 1fr 1fr;
            grid-template-rows: 1fr;
            grid-column-gap: 0.125rem;
            padding: 0.25rem 0;

            button {
                margin: 0;
                padding-top: 0;
                padding-bottom: 0;
            }

            select {
                margin: 0;
                padding-top: 0;
                padding-bottom: 0;
            }
        }

        & .stats {
            text-align: right;
            font-size: small;
        }

        & canvas {
            display: block;
            margin: 0 auto;
            overflow: scroll;
        }
    }

    & .terminal {
        display: flex;
        flex-flow: column nowrap;
        background: black;
        height: 12rem;
        color: white;

        & div.content {
            overflow-x: hidden;
            overflow-y: scroll;
            flex-grow: 1;
            font-family: monospace;
            font-size: 1rem;
            white-space: pre;

            & .stdout {
                color: green;
            }

            & .stderr {
                color: red;
            }
        }

        & input.terminal-input {
            background: white;
            color: black;
            margin: 0;
            border: 0;
            padding: 0;
            transition: background 0.5s ease-in-out;
        }

        & input.terminal-input:disabled {
            background: black;
        }
    }
}
` });
    const textFiles = ["slides.html"];
    return html`
            <div class="slidegen">
                <${TextEditor} text-files=${textFiles} filepathStore=${this.#filepathStore} />
                <div class="pico">
                    <fieldset role="group">
                        <${Button} icon="play-circle" class="secondary" name="Update" onClick=${this.#onUpdate} />
                    </fieldset>
                </div>
            </div>
        `;
  }
};

// js/applets/slidegen/entrypoint.js
var entrypoint_default = Slidegen;
export {
  entrypoint_default as default
};
