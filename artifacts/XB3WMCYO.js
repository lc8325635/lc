import {
  TextArea,
  globalEnv,
  html,
  loadCss,
  preact_exports,
  stores_exports,
  string_exports
} from "./chunks/MU5EPMOO.js";
import "./chunks/U4FYQBOV.js";

// js/applets/compress-fu/CompressFu.js
var definitionRegex = /([a-z])[=](.*)/;
var CompressFu = class extends preact_exports.Component {
  #compressedTextStore;
  #compressedSize;
  constructor(props) {
    super(props);
    this.#compressedTextStore = props.store ?? stores_exports.PrimitiveStore.of("");
    this.state = {
      originalLines: [],
      originalSize: 0,
      compressedSize: 0,
      restoredLines: []
    };
  }
  componentDidMount() {
    this.#compressedTextStore.addAndFireListener(this.#onChangeText);
    this.#loadText();
  }
  componentWillUnmount() {
    this.#compressedTextStore.removeListener(this.#onChangeText);
  }
  async #loadText() {
    const text = await globalEnv.files.load(this.props["lyrics-file"]);
    const capText = text.toUpperCase();
    const originalLines = this.#splitLines(capText);
    let originalSize = 0;
    for (const line of originalLines) {
      originalSize += line.length + 1;
    }
    this.setState({
      originalLines,
      originalSize,
      restoredLines: []
    });
    this.#compressedTextStore.setValue(originalLines.join("\n"));
  }
  #splitLines(text) {
    const lines = [];
    for (const line of string_exports.splitLines(text)) {
      lines.push(line.trim());
    }
    return lines;
  }
  #expandLine(line, dictionary) {
    const expand = (key) => dictionary[key] ?? "";
    for (let count = 0; count < 20; count += 1) {
      const newLine = line.replace(/[a-z]/g, expand);
      if (newLine === line) break;
      line = newLine;
    }
    return line.replace(/[_.\-]/g, " ").trim();
  }
  #onChangeText = (event) => {
    const dictionary = {};
    let compressedSize = 0;
    const compressedLines = this.#splitLines(event.newValue);
    const restoredLines = [];
    for (const compressedLine of compressedLines) {
      const definitionMatch = compressedLine.match(definitionRegex);
      compressedSize += compressedLine.length + 1;
      if (definitionMatch) {
        const key = definitionMatch[1];
        const value = definitionMatch[2];
        dictionary[key] = value.trim();
      } else {
        const restoredLine = this.#expandLine(compressedLine, dictionary);
        restoredLines.push(restoredLine);
      }
    }
    this.setState({ compressedSize, restoredLines });
  };
  render() {
    loadCss({ path: `js/applets/compress-fu/compress-fu.css`, content: `.compress-fu {
    div.diff-view {
        position: relative;
        overflow: auto;
        width: 100%;
        height: 20rem;

        & .diff-layer {
            white-space: pre;
            position: absolute;
            inset: 0;
        }

        & .original {
            color: #00ffff;
            opacity: 0.5;
        }

        & .restored {
            color: #ff0000;
        }
    }

    & div.report {
        text-align: right;
        color: green;
    }

    & div.report.error {
        color: red;
    }

    .uppercase textarea {
//        text-transform: uppercase;
    }
}
` });
    const originalText = this.state.originalLines.join("\n").trim();
    const restoredText = this.state.restoredLines.join("\n").trim();
    const compressedPercentage = Math.round(this.state.compressedSize * 100 / originalText.length);
    const report = restoredText === originalText ? html`
            <div class="report">
                Compressed size: ${this.state.compressedSize} bytes
                (${compressedPercentage}%)
            </div>
        ` : html`
            <div class="report error">
                The restored text does not match the original!
            </div>
        `;
    return html`
            <div class="compress-fu pico">
                <section>
                    <h2>The uncompressed text</h2>
                    <div class="diff-view">
                        <div class="diff-layer restored">${restoredText}</div>
                        <div class="diff-layer original">${originalText}</div>
                    </div>
                    ${report}
                </section>
                <section>
                    <h2>The compressed text</h2>
                    <div class="uppercase">
                        <${TextArea} store=${this.#compressedTextStore} cols=${40} rows=${10}/>
                    </div>
                </section>
            </div>
        `;
  }
};

// js/applets/compress-fu/entrypoint.js
var entrypoint_default = CompressFu;
export {
  entrypoint_default as default
};
