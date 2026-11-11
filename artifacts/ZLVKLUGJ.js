import {
  html,
  preact_exports,
  scripts_exports
} from "./chunks/MU5EPMOO.js";
import "./chunks/U4FYQBOV.js";

// js/applets/geogebra/Geogebra.js
var url = "https://geogebra.org/apps/deployggb.js";
var nextDomId = 0;
var Geogebra = class extends preact_exports.Component {
  #scriptId;
  #domId;
  constructor(props) {
    super(props);
    this.#scriptId = null;
    this.#domId = `geogebra-${nextDomId++}`;
    this.state = {
      ggProps: {
        appName: "classic",
        width: 800,
        height: 600,
        showToolBar: true,
        showAlgebraInput: true,
        showMenuBar: true,
        reloadOnPropChange: false
      }
    };
  }
  async #loadGeogebra() {
    if (!this.#scriptId) {
      this.scriptId = await scripts_exports.loadScript(url);
    }
  }
  componentDidMount() {
    const ggbApp = new window.GGBApplet(this.state.ggProps, true);
    ggbApp.inject(id);
  }
  componponentWillUnmount() {
  }
  render() {
    return html`
            <div id=${this.#domId}>
                <div id={this.#domId}></div>
            </div>
        `;
  }
};

// js/applets/geogebra/entrypoint.js
var entrypoint_default = Geogebra;
export {
  entrypoint_default as default
};
