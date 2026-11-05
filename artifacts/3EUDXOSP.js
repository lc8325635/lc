import {
  BitString,
  Button,
  CanvasController,
  DialogLayer,
  DialogModel,
  DialogWindow,
  ListenerList,
  ObjectSelector,
  StaticCanvas,
  globalEnv,
  html,
  preact_exports,
  stores_exports,
  styles_exports
} from "./chunks/IM4XGPPB.js";
import "./chunks/U4FYQBOV.js";

// js/applets/pixel-matching-learner/ByteMap.js
var ByteMap = class _ByteMap {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.data = new Uint8Array(this.width * height);
    this.listenerList = new ListenerList();
  }
  clone() {
    const byteMap = new _ByteMap(this.width, this.height);
    for (let i = 0; i < this.data.length; i += 1) {
      byteMap.data[i] = this.data[i];
    }
    return byteMap;
  }
  clear() {
    this.data.fill(0);
    this.listenerList.fire({});
  }
  getAddr(x, y) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return y * this.width + x;
    }
    return null;
  }
  setPixel(x, y, newValue) {
    const addr = this.getAddr(x, y);
    if (addr === null || this.data[addr] === newValue) {
      return false;
    } else {
      this.data[addr] = newValue;
      this.listenerList.fire({});
      return true;
    }
  }
  getPixel(x, y) {
    const addr = this.getAddr(x, y);
    return this.data[addr];
  }
  merge(sources) {
    const scale = 1 / sources.length;
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        const addr = y * this.width + x;
        let value = 0;
        for (const source of sources) {
          value += source.getPixel(x, y) * scale;
        }
        this.data[addr] = Math.round(value);
      }
    }
    this.listenerList.fire({});
  }
  compare(byteMap) {
    if (byteMap.width !== this.width || byteMap.height !== this.height) {
      return 1;
    }
    let total = 0;
    for (let i = 0; i < this.data.length; i += 1) {
      const value1 = byteMap.data[i];
      const value2 = this.data[i];
      const delta = value1 - value2;
      total += delta * delta;
    }
    const maxDifference = 255 * 255 * this.data.length;
    return total / maxDifference;
  }
  fromHex(text) {
    const bitString = BitString.fromHex(text);
    for (let i = 0; i < this.data.length; i += 1) {
      this.data[i] = bitString.getBit(i) ? 255 : 0;
    }
  }
  toHex() {
    const bitString = new BitString();
    for (let i = 0; i < this.data.length; i += 1) {
      if (this.data[i]) bitString.setBit(i, true);
    }
    return bitString.toHex();
  }
};

// js/applets/pixel-matching-learner/ByteMapImage.js
var ByteMapImage = class extends preact_exports.Component {
  #controller;
  #byteMap;
  constructor(props) {
    super(props);
    this.state = {
      penColour: 255,
      isEditable: props.isEditable ?? false
    };
    const cellSize = props.cellSize ?? 5;
    this.#byteMap = props.byteMap;
    this.#controller = new CanvasController({
      preferredSize: {
        x: this.#byteMap.width * cellSize,
        y: this.#byteMap.height * cellSize
      }
    });
  }
  componentDidMount() {
    if (this.state.isEditable) {
      this.#controller.listenerMap.add("pointer-move", this.#onPointerMove);
      this.#controller.listenerMap.add("pointer-down", this.#onPointerDown);
    }
    this.#controller.listenerMap.add("repaint", this.#onByteMapUpdate);
    this.#byteMap.listenerList.add(this.#onByteMapUpdate);
    this.#render();
  }
  componentWillUnmount() {
    this.#controller.listenerMap.remove("repaint", this.#onByteMapUpdate);
    if (this.state.isEditable) {
      this.#controller.listenerMap.remove("pointer-down", this.#onPointerDown);
      this.#controller.listenerMap.remove("pointer-move", this.#onPointerMove);
    }
    this.#byteMap.listenerList.remove(this.#onByteMapUpdate);
  }
  #onByteMapUpdate = (event) => {
    this.#render();
  };
  #calculateCellSize(pixelWidth, pixelHeight) {
    const byteMap = this.#byteMap;
    return Math.floor(Math.min(pixelWidth / byteMap.width, pixelHeight / byteMap.height));
  }
  #render() {
    const byteMap = this.#byteMap;
    const canvas = this.#controller.canvas;
    const context2d = canvas.getContext("2d");
    const cellSize = this.#calculateCellSize(canvas.width, canvas.height);
    context2d.fillStyle = "#080";
    context2d.fillRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < byteMap.height; y += 1) {
      for (let x = 0; x < byteMap.width; x += 1) {
        const c = byteMap.getPixel(x, y).toString(16).padStart(2, "0");
        context2d.fillStyle = `#${c}${c}${c}`;
        context2d.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
      }
    }
  }
  #onPointerMove = (event) => {
    const canvas = this.#controller.canvas;
    const context2d = canvas.getContext("2d");
    const cellSize = this.#calculateCellSize(canvas.width, canvas.height);
    const gridX = Math.floor(event.x / cellSize);
    const gridY = Math.floor(event.y / cellSize);
    if (event.isPressed) {
      const hasChanged = this.#byteMap.setPixel(gridX, gridY, this.state.penColour);
      if (hasChanged) this.#render();
    }
  };
  #onPointerDown = (event) => {
    const canvas = this.#controller.canvas;
    const context2d = canvas.getContext("2d");
    const cellSize = this.#calculateCellSize(canvas.width, canvas.height);
    const gridX = Math.floor(event.x / cellSize);
    const gridY = Math.floor(event.y / cellSize);
    const hasChanged = this.#byteMap.setPixel(gridX, gridY, this.state.penColour);
    if (hasChanged) this.#render();
  };
  #onClickClear = (event) => {
    this.#byteMap.clear();
  };
  #onClickPaint = (event) => {
    this.setState({ penColour: 255 });
  };
  #onClickErase = (event) => {
    this.setState({ penColour: 0 });
  };
  render() {
    const toolbar = this.state.isEditable ? html`
            <div class="toolbar">
                <${Button} icon="x-circle" name="Clear" onClick=${this.#onClickClear} />
                <${Button} icon="paint" name="Paint" disabled=${!!this.state.penColour} onClick=${this.#onClickPaint} />
                <${Button} icon="erase" name="Erase" disabled=${!this.state.penColour} onClick=${this.#onClickErase} />
            </div>
        ` : null;
    return html`
            ${toolbar}
            <${StaticCanvas} controller=${this.#controller} />
        `;
  }
};

// js/applets/pixel-matching-learner/LabelledImage.js
var LabelledImage = class _LabelledImage {
  static fromString(width, height, text) {
    const label = text.charAt(0);
    const image = new ByteMap(width, height);
    image.fromHex(text.substring(1));
    return new _LabelledImage(label, image);
  }
  constructor(label, image) {
    this.label = label;
    this.image = image;
  }
  toString() {
    return this.label + this.image.toHex();
  }
};

// js/applets/pixel-matching-learner/testData.js
var testData = [
  "A081C34267EC3C180",
  "A18183C247E42C380",
  "A0C0C1C14363E6341",
  "A00003C34347C58",
  "A003E223C36223E",
  "A18284C44FE828301",
  "A1C3622427EC28181",
  "A00003C2464647C",
  "A001E1222627EC0",
  "A1C346442FE828282",
  "A1C36223C2446667C",
  "A00183C247C4242C3",
  "B7E66347CC4C47C0C",
  "B0E3A321E1A22223E",
  "B6E42723F6242623E",
  "B1E3414FC8484641C",
  "B020202023E24243E",
  "B0202023E2622321E",
  "B0604043C644C6838",
  "B1E32223E3622321E",
  "B7E623E7EC2C2721E",
  "B0202023E2224341C",
  "B3E321E7E42427A0E",
  "B0604043C2444643C",
  "C3E22438103C24E38",
  "C007E4202022638",
  "C7E424282060478",
  "C007C020202065C70",
  "C1F3101010141423E",
  "C003C640602361C",
  "C0C7642030143663C",
  "C3CC6830103C67C30",
  "C003C06020303423C",
  "C000C3602023E",
  "C3C66420202020EF8",
  "C00784E02066C38"
];

// js/applets/pixel-matching-learner/PixelMatchingLearner.js
var WIDTH = 8;
var HEIGHT = 8;
var PixelMatchingLearner = class extends preact_exports.Component {
  #editorByteMap;
  #labelStore;
  #dialogModel;
  #labels = ["A", "B", "C"];
  #heatmaps = [];
  constructor(props) {
    super(props);
    this.#editorByteMap = new ByteMap(WIDTH, HEIGHT);
    this.#labelStore = stores_exports.PrimitiveStore.of(this.#labels[0]);
    this.#dialogModel = new DialogModel();
    this.state = {
      labelledImages: [],
      recognisedAs: "",
      highlightMatch: false,
      score: 0
    };
    for (let i = 0; i < this.#labels.length; i += 1) {
      this.#heatmaps.push(new ByteMap(WIDTH, HEIGHT));
    }
    this.#loadTrainingData();
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  #loadTrainingData() {
    try {
      const store = globalEnv.getStorage();
      const saveData = store.getItem("training-data");
      const labelledImages = [];
      for (const saveDatum of saveData) {
        const labelledImage = LabelledImage.fromString(8, 8, saveDatum);
        labelledImages.push(labelledImage);
      }
      this.#resetState(labelledImages);
    } catch (e) {
      console.warn(e);
    }
  }
  #saveTrainingData(labelledImages) {
    const store = globalEnv.getStorage();
    let saveData = [];
    for (const labelledImage of labelledImages) {
      saveData.push(labelledImage.toString());
    }
    store.setItem("training-data", saveData);
  }
  #recognise(byteMap) {
    let bestScore = 2;
    let bestMatch = null;
    for (let i = 0; i < this.#labels.length; i += 1) {
      const heatmap = this.#heatmaps[i];
      const score = heatmap.compare(byteMap);
      if (score < bestScore) {
        bestScore = score;
        bestMatch = i;
      }
    }
    return this.#labels[bestMatch];
  }
  #resetState(labelledImages) {
    this.setState({ labelledImages, recognisedAs: "" });
    this.#editorByteMap.clear();
    const sources = {};
    for (const label of this.#labels) {
      sources[label] = [];
    }
    for (const labelledImage of labelledImages) {
      sources[labelledImage.label].push(labelledImage.image);
    }
    for (let i = 0; i < this.#heatmaps.length; i += 1) {
      const label = this.#labels[i];
      const heatmap = this.#heatmaps[i];
      heatmap.merge(sources[label]);
    }
  }
  #onAddData = (event) => {
    const label = this.#labelStore.getValue();
    const byteMap = this.#editorByteMap.clone();
    const labelledImage = new LabelledImage(label, byteMap);
    const labelledImages = [...this.state.labelledImages, labelledImage];
    this.#resetState(labelledImages);
    this.#saveTrainingData(labelledImages);
  };
  #onRecognise = (event) => {
    const label = this.#recognise(this.#editorByteMap);
    this.setState({
      recognisedAs: label,
      highlightMatch: true
    });
    window.setTimeout((event2) => {
      this.setState({
        highlightMatch: false
      });
    }, 600);
  };
  #onTestData = async (event) => {
    let score = 0;
    for (const datum of testData) {
      const labelledImage = LabelledImage.fromString(WIDTH, HEIGHT, datum);
      const label = this.#recognise(labelledImage.image);
      if (label === labelledImage.label) score += 1;
    }
    const percentage = Math.round(100 * score / testData.length);
    this.setState({ score: percentage });
    await this.#dialogModel.open("test-results");
  };
  render() {
    styles_exports.loadCss({ path: `js/applets/pixel-matching-learner/pixel-matching-learner.css`, content: `div.pixel-matching-learner {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    .toolbar {
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        justify-content: start;
        gap: 1rem;

        & button {
            margin: 0;
            height: 3rem;
        }
    }

    div.carousel, div.heatmaps {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        overflow-x: auto;
        width: 30rem;
    }

    div.labelled-image, div.heatmap {
        display: flex;
        flex-flow: column wrap;
        justify-content: start;
        align-items: center;

        input {
            display: block;
        }
    }
}
` });
    const carousel = [];
    const labelledImages = this.state.labelledImages;
    for (let i = 0; i < labelledImages.length; i += 1) {
      const labelledImage = labelledImages[i];
      const deleteLabelledImage = (event) => {
        const newLabelledImages = labelledImages.filter((x) => x !== labelledImage);
        this.#resetState(newLabelledImages);
        this.#saveTrainingData(newLabelledImages);
      };
      const element = html`
                <div class="labelled-image" key=${labelledImage.toString()}>
                    <input class="widget" type="button" value="❌" onClick=${deleteLabelledImage} />
                    <${ByteMapImage} key=${i} byteMap=${labelledImage.image} />
                    <div>${labelledImage.label}</div>
                </div>
            `;
      carousel.push(element);
    }
    const heatmaps = [];
    for (let i = 0; i < this.#labels.length; i += 1) {
      const label = this.#labels[i];
      const heatmap = this.#heatmaps[i];
      const element = html`
                <div class="heatmap">
                    <div>
                        ${label}
                    </div>
                    <${ByteMapImage} key=${i} byteMap=${heatmap} cellSize=${10} />
                </div>
            `;
      heatmaps.push(element);
    }
    const inputClass = this.state.highlightMatch ? "highlight" : "";
    return html`
            <div class="pixel-matching-learner">
                <${ByteMapImage} byteMap=${this.#editorByteMap} cellSize=${20} isEditable=${true} />

                <div class="toolbar">
                    <${Button} name="Recognise" onClick=${this.#onRecognise} />
                    <${Button} name="Add to training data" onClick=${this.#onAddData} />
                    <${Button} name="Run the test data" onClick=${this.#onTestData} />
                </div>

                <div class="pico">
                    <div role="group">
                        <label>Recognised as:
                            <input class=${inputClass} disabled value=${this.state.recognisedAs} />
                        </label>
                        <label>Correct label:
                            <${ObjectSelector} store=${this.#labelStore} options=${this.#labels} canHighlight=${true} />
                        </label>
                    </div>

                    <h2>Heatmaps</h2>
                    <div class="heatmaps">
                        ${heatmaps}
                    </div>

                    <h2>Training data</h2>
                    <div class="carousel">
                        ${carousel}
                    </div>
                </div>

                <${DialogLayer} model=${this.#dialogModel}>
                    <${DialogWindow} name="test-results" title="Test results" buttons="OK">
                        <p>
                            You achieved a score of ${this.state.score}% on the training data.
                        </p>
                    <//>
                <//>
            </div>
        `;
  }
};

// js/applets/pixel-matching-learner/entrypoint.js
var entrypoint_default = PixelMatchingLearner;
export {
  entrypoint_default as default
};
