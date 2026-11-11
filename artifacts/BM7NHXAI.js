import {
  Sandbox,
  TextEditor
} from "./chunks/ODLH24VM.js";
import "./chunks/LVCZT5H5.js";
import {
  globalEnv,
  html,
  preact_exports,
  stores_exports,
  styles_exports
} from "./chunks/MU5EPMOO.js";
import "./chunks/U4FYQBOV.js";

// js/applets/minide/Minide.js
var Minide = class extends preact_exports.Component {
  #filepathStore;
  #filepaths;
  constructor(props) {
    super(props);
    this.#filepathStore = stores_exports.PrimitiveStore.of();
  }
  componentDidMount() {
    this.#filepathStore.addAndFireListener(this.onSelectFilepath);
  }
  componentWillUnmount() {
    this.#filepathStore.removeListener(this.onSelectFilepath);
  }
  onSelectFilepath = (event) => {
    globalEnv.pageVariables.setValue("activeFilename", event.newValue);
  };
  render() {
    const { gfx, ...rest } = this.props;
    styles_exports.loadCss({ path: `js/applets/minide/minide.css`, content: `.minide {
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
    const preludeFiles = this.props["prelude-files"];
    const sourceFiles = this.props["source-files"];
    return html`
            <div class="minide">
                <${TextEditor} text-files=${sourceFiles} filepathStore=${this.#filepathStore} />
                <${Sandbox} prelude-files=${preludeFiles} filepathStore=${this.#filepathStore} gfx=${gfx} />
            </div>
        `;
  }
};

// js/applets/minide/entrypoint.js
var entrypoint_default = Minide;
export {
  entrypoint_default as default
};
