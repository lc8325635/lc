import {
  Button,
  ObjectSelector,
  html,
  image_exports,
  object_exports,
  preact_exports,
  stores_exports,
  styles_exports,
  windowEvents
} from "./chunks/MU5EPMOO.js";
import "./chunks/U4FYQBOV.js";

// js/applets/convolution-editor/Convolution.js
var DEFAULT_MATRIX = [
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0]
];
var Convolution = class _Convolution {
  constructor(matrix = DEFAULT_MATRIX) {
    this.matrix = matrix;
  }
  getMatrixElement(my, mx) {
    return this.matrix[my][mx];
  }
  setMatrixElement(my, mx, value) {
    const matrix = [];
    for (const row of this.matrix) {
      matrix.push(Array.from(row));
    }
    matrix[my][mx] = value;
    return new _Convolution(matrix);
  }
  applyTo(viewCanvas, image) {
    const matrix = this.matrix;
    const editCanvas = new OffscreenCanvas(image.width, image.height);
    const srcWidth = editCanvas.width;
    const srcHeight = editCanvas.height;
    const srcCtx = editCanvas.getContext("2d", { willReadFrequently: true });
    const stride = srcWidth * 4;
    srcCtx.drawImage(image, 0, 0);
    const oldData = srcCtx.getImageData(0, 0, srcWidth, srcHeight)?.data;
    const newData = oldData.slice(0);
    for (let y = 1; y < srcWidth - 1; y++) {
      for (let x = 1; x < srcHeight - 1; x++) {
        const addr = y * stride + x * 4;
        let sum = 0;
        sum += oldData[addr - stride - 4] * matrix[0][0];
        sum += oldData[addr - stride] * matrix[0][1];
        sum += oldData[addr - stride + 4] * matrix[0][2];
        sum += oldData[addr - 4] * matrix[1][0];
        sum += oldData[addr] * matrix[1][1];
        sum += oldData[addr + 4] * matrix[1][2];
        sum += oldData[addr + stride - 4] * matrix[2][0];
        sum += oldData[addr + stride] * matrix[2][1];
        sum += oldData[addr + stride + 4] * matrix[2][2];
        const clamped = Math.max(0, Math.min(255, Math.round(sum)));
        newData[addr] = newData[addr + 1] = newData[addr + 2] = clamped;
      }
    }
    const srcImage = new ImageData(newData, srcWidth, srcHeight);
    srcCtx.putImageData(srcImage, 0, 0);
    const dstCtx = viewCanvas.getContext("2d");
    const dstWidth = viewCanvas.width;
    const dstHeight = viewCanvas.height;
    dstCtx.imageSmoothingEnabled = false;
    dstCtx.drawImage(editCanvas, 0, 0, srcWidth, srcHeight, 0, 0, dstWidth, dstHeight);
  }
};

// js/applets/convolution-editor/ConvolutionEditor.js
var pictureList = [
  "tiger",
  "flowers"
];
var identityConvolution = new Convolution();
var ConvolutionEditor = class extends preact_exports.Component {
  #viewCanvasRef = null;
  #originalData = null;
  #pictureNameStore;
  #frameHistory = {};
  constructor(props) {
    super(props);
    this.#pictureNameStore = stores_exports.PrimitiveStore.of(pictureList[0]);
    this.state = {
      image: null,
      userConvolution: identityConvolution,
      activeConvolution: identityConvolution
    };
  }
  async #loadImage(imageName) {
    const url = `images/${imageName}.png`;
    const image = await image_exports.load(url);
    this.setState({ image });
  }
  componentDidMount() {
    this.#loadImage("tiger");
    windowEvents.add("onAnimationFrame", this.#onAnimationFrame);
    this.#pictureNameStore.addListener(this.#onChangePictureName);
  }
  componentWillUnmount() {
    this.#pictureNameStore.removeListener(this.#onChangePictureName);
    windowEvents.remove("onAnimationFrame", this.#onAnimationFrame);
  }
  #onChangePictureName = (event) => {
    this.#loadImage(event.newValue);
  };
  #onApplyFilter = (event) => {
    this.setState({ activeConvolution: this.state.userConvolution });
  };
  #onRemoveFilter = (event) => {
    this.setState({ activeConvolution: identityConvolution });
  };
  #onAnimationFrame = (event) => {
    const history = this.#frameHistory;
    const viewCanvas = this.#viewCanvasRef;
    const convolution = this.state.activeConvolution;
    const image = this.state.image;
    const newHistory = { image, viewCanvas, convolution };
    if (object_exports.update(history, newHistory)) {
      if (viewCanvas) {
        convolution.applyTo(viewCanvas, image);
      }
    }
  };
  #renderMatrix() {
    const matrixElements = [];
    const convolution = this.state.userConvolution;
    for (let my = 0; my < 3; my += 1) {
      const y = my;
      for (let mx = 0; mx < 3; mx += 1) {
        const x = mx;
        const key = `${my},${mx}`;
        const value = convolution.getMatrixElement(my, mx);
        const onChange = (event) => {
          const newValue = parseFloat(event.currentTarget.value);
          const oldConvolution = this.state.userConvolution;
          const newConvolution = oldConvolution.setMatrixElement(y, x, newValue ?? 0);
          this.setState({ userConvolution: newConvolution });
        };
        const element = html`
                    <input
                        key=${key}
                        type="text"
                        inputmode="decimal"
                        pattern="[0-9.]*"
                        value=${value}
                        onChange=${onChange}
                    />
                `;
        matrixElements.push(element);
      }
    }
    return matrixElements;
  }
  render() {
    styles_exports.loadCss({ path: `js/applets/convolution-editor/convolution-editor.css`, content: `.convolution-editor {
    .matrix {
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 4px;

        max-width: 20rem;

        padding: 1rem;
        background: black;
        color: white;

        input {
            text-align: center;
            height: 3rem;
        }
    }

    canvas {
        display: block;
        margin: 0 auto;
    }
}
` });
    const setViewCanvasRef = (node) => this.#viewCanvasRef = node;
    const matrix = this.#renderMatrix();
    const image = this.state.image;
    if (!image) return null;
    return html`
            <div class="convolution-editor pico">
                <article>
                    <header>Convolution matrix</header>
                    <div class="matrix">${matrix}</div>
                    <footer role="group">
                        <${Button} onClick=${this.#onApplyFilter} name="Apply filter" />
                        <${Button} onClick=${this.#onRemoveFilter} name="Remove filter" class="secondary" />
                    </footer>
                </article>

                <article>
                    <canvas
                        ref=${setViewCanvasRef}
                        width=${image.width * 2}
                        height=${image.height * 2}
                    />
                    <footer>
                        <label>Current picture:
                            <${ObjectSelector} options=${pictureList} store=${this.#pictureNameStore} />
                        </label>
                    </footer>
                </article>
            </div>
        `;
  }
};

// js/applets/convolution-editor/entrypoint.js
var entrypoint_default = ConvolutionEditor;
export {
  entrypoint_default as default
};
