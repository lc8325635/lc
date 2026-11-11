import {
  CanvasController,
  DialogLayer,
  DialogModel,
  DialogWindow,
  StaticCanvas,
  TextInput,
  html,
  loadCss,
  preact_exports,
  stores_exports
} from "./chunks/MU5EPMOO.js";
import "./chunks/U4FYQBOV.js";

// js/applets/datacentre-simulator/InfoPanel.js
var InfoPanel = class extends preact_exports.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return html`
            <div class="info-panel">
                <div class="shrink">
                    <img src="../../../img/applets/datacentre-simulator/${this.props.img}.png" />
                </div>
                <div class="grow">
                    ${this.props.children}
                </div>
            </div>
        `;
  }
};

// js/applets/datacentre-simulator/state.js
var money = signal();
function reset() {
  money.value = 1e7;
}
reset();

// js/applets/datacentre-simulator/DatacentreSimulator.js
var DatacentreSimulator = class extends preact_exports.Component {
  #dialogModel;
  #canvasController;
  #textStore;
  constructor(props) {
    super(props);
    this.#dialogModel = new DialogModel();
    this.#canvasController = new CanvasController();
    this.#textStore = stores_exports.PrimitiveStore.of("");
    this.state = {
      money: 0
    };
  }
  componentDidMount() {
    this.#dialogModel.open("introduction");
  }
  componentWillUnmount() {
  }
  render() {
    loadCss({ path: `js/applets/datacentre-simulator/datacentre-simulator.css`, content: `.datacentre-simulator {
    position: relative;

    .ui-overlay {
        position: absolute;
        inset: 0;
    }

    .info-panel {
        display: flex;
        justify-content: stretch;
        gap: 8px;

        .shrink {
            flex-shrink: 0;

            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            align-items: center;
        }

        .grow {
            flex-grow: 1;
            overflow-y: auto;
        }
    }
}
` });
    return html`
            <div class="datacentre-simulator">
                <${StaticCanvas} width=${400} height=${400} />
                <div class="ui-overlay">
                    <p>Money: €${this.state.money.toLocaleString()}</p>
                </div>
                <${DialogLayer} model=${this.#dialogModel}>
                    <${DialogWindow} name="introduction" title="Introduction" buttons="Next">
                        <${TextInput} store=${this.#textStore} />
                        <${InfoPanel} img="workman">
                            <p>
                                Hello and welcome to datacentre simulator!
                            </p>
                            <p>
                                This simulation makes you project manager at a
                                software company that wants to expand into the
                                datacentre business.
                            </p>
                            <p>
                                You will receive an initial budget
                                of €<b>${this.state.money.toLocaleString()}</b> to
                                start construction of your first
                                datacentre.
                            </p>
                        <//>
                    <//>
                <//>
            </div>
        `;
  }
};

// js/applets/datacentre-simulator/entrypoint.js
var entrypoint_default = DatacentreSimulator;
export {
  entrypoint_default as default
};
