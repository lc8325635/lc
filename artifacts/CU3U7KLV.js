import {
  Button,
  Random,
  TextArea,
  html,
  preact_exports,
  stores_exports,
  styles_exports,
  windowEvents
} from "./chunks/MU5EPMOO.js";
import "./chunks/U4FYQBOV.js";

// js/applets/markov-generator/Token.js
var Token = class {
  constructor(word) {
    this.word = word;
    this.transitions = {};
    this.edges = null;
  }
  #getTransitions() {
    const transitions = [];
    for (const [word, frequency] of Object.entries(this.transitions)) {
      transitions.push({ word, frequency });
    }
    transitions.sort((a, b) => a.frequency - b.frequency);
    return transitions;
  }
  #createEdges() {
    const cps = [];
    const words = [];
    const transitions = this.#getTransitions();
    if (transitions.length > 0) {
      let cumulativeProbability = 0;
      const probabilityScale = 1 / transitions.length;
      for (const transition of transitions) {
        cumulativeProbability += transition.frequency * probabilityScale;
        cps.push(cumulativeProbability);
        words.push(transition.word);
      }
    }
    return { cps, words };
  }
  addNextWord(word) {
    this.transitions[word] = (this.transitions[word] ?? 0) + 1;
    this.edges = null;
  }
  generate() {
    if (!this.edges) this.edges = this.#createEdges();
    const r = Math.random();
    const cps = this.edges.cps;
    for (let i = 0; i < cps.length; i += 1) {
      if (r <= cps[i]) return this.edges.words[i];
    }
    return null;
  }
  toString() {
    const transitions = [];
    for (const [word, count] of Object.entries(this.transitions)) {
      transitions.push(`(${count})${word}`);
    }
    return `Token(${this.word}, ${transitions.join(",")})`;
  }
};

// js/applets/markov-generator/MarkovGenerator.js
var MarkovGenerator = class extends preact_exports.Component {
  #trainingTextStore;
  #generatedTextStore;
  #random;
  #trainedTokens = null;
  constructor(props) {
    super(props);
    this.#trainingTextStore = stores_exports.PrimitiveStore.of("", "markov-training.txt");
    this.#generatedTextStore = stores_exports.PrimitiveStore.of("");
    this.#random = new Random();
    this.state = {
      isGenerating: false,
      status: ""
    };
  }
  componentDidMount() {
    this.#trainingTextStore.addListener(this.#onTrainingTextStore);
    windowEvents.add("onTick500", this.#onTick500);
  }
  componentWillUnmount() {
    windowEvents.remove("onTick500", this.#onTick500);
    this.#trainingTextStore.removeListener(this.#onTrainingTextStore);
  }
  #getWords(text) {
    const words = [];
    for (const match of text.toLowerCase().matchAll(/[a-z']+/g)) {
      words.push(match[0]);
    }
    return words;
  }
  #trainTokens() {
    const trainingText = this.#trainingTextStore.getValue();
    const tokens = {};
    let lastToken = new Token("#start");
    for (const word of this.#getWords(trainingText)) {
      let token = tokens[word];
      if (token === void 0) {
        token = new Token(word);
        tokens[word] = token;
      }
      lastToken.addNextWord(word);
      lastToken = token;
    }
    return tokens;
  }
  #getTrainedTokens() {
    if (!this.#trainedTokens) {
      this.#trainedTokens = this.#trainTokens();
    }
    return this.#trainedTokens;
  }
  #generateNextWord(priorText) {
    const clipIndex = Math.max(0, priorText.length - 256);
    priorText = priorText.substring(clipIndex);
    let generatedWord = null;
    const tokens = this.#getTrainedTokens();
    const priorWords = this.#getWords(priorText);
    if (priorWords.length > 0) {
      const lastWord = priorWords[priorWords.length - 1];
      const lastToken = tokens[lastWord];
      generatedWord = lastToken?.generate();
    }
    if (!generatedWord) {
      const possibleWords = Object.keys(tokens);
      generatedWord = this.#random.choice(possibleWords);
    }
    return generatedWord;
  }
  #onTrainingTextStore = (event) => {
    this.#trainedTokens = null;
  };
  #onClickStart = (event) => {
    this.setState({ isGenerating: true });
  };
  #onClickStop = (event) => {
    this.setState({ isGenerating: false });
  };
  #onClickClear = (event) => {
    this.#generatedTextStore.setValue("");
  };
  #onTick500 = (event) => {
    const text = this.#generatedTextStore.getValue();
    if (!this.state.isGenerating) {
      this.setState({ status: "Generation stopped." });
    } else if (text.length >= 1e3) {
      this.setState({ status: "Cannot generate more: the text has reached the maximum length." });
    } else {
      let generatedWord = this.#generateNextWord(text);
      if (text.length > 0 && !text.endsWith(" ")) {
        generatedWord = ` ${generatedWord}`;
      }
      this.#generatedTextStore.setValue(text + generatedWord);
      this.setState({ status: "Generating text..." });
    }
  };
  render() {
    styles_exports.loadCss({ path: `js/applets/markov-generator/markov-generator.css`, content: `.markov-generator {
}
` });
    return html`
            <div class="markov-generator pico">
                <fieldset>
                    <label>
                        <span class="label">Training data</span>
                        <${TextArea} rows=${10} store=${this.#trainingTextStore} />
                    </label>
                </fieldset>
                <div role="group">
                    <${Button} name="Clear" onClick=${this.#onClickClear} />
                    <${Button} name="Start generating" class="secondary" onClick=${this.#onClickStart} disabled=${this.state.isGenerating} />
                    <${Button} name="Stop generating" class="secondary" onClick=${this.#onClickStop} disabled=${!this.state.isGenerating} />
                </div>
                <fieldset>
                    <label class="bold">
                        <span class="label">Generated text</span>
                        <${TextArea} rows=${10} store=${this.#generatedTextStore} />
                    </label>
                    <small>${this.state.status}</small>
                </fieldset>
            </div>
        `;
  }
};

// js/applets/markov-generator/entrypoint.js
var entrypoint_default = MarkovGenerator;
export {
  entrypoint_default as default
};
