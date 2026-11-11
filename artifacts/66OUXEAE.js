import {
  Button,
  PinyinString,
  TextInput,
  clipboard_exports,
  html,
  preact_exports,
  rpc,
  stores_exports,
  styles_exports,
  url_exports
} from "./chunks/MU5EPMOO.js";
import "./chunks/U4FYQBOV.js";

// js/applets/hzdict/hanzi-text.js
function isHanzi(letter) {
  const codepoint = letter.codePointAt(0);
  if (codepoint >= 19968 && codepoint <= 40959) return true;
  if (codepoint >= 13312 && codepoint <= 19903) return true;
  if (codepoint >= 63744 && codepoint <= 64255) return true;
  if (codepoint >= 131072) return true;
  return false;
}
function annotate(text) {
  const elements = [];
  let letters = "";
  if (typeof text !== "string") {
    throw new Error(`Invalid string: ${text}`);
  }
  for (const letter of text) {
    if (isHanzi(letter)) {
      if (letters !== "") elements.push(letters);
      const codepoint = letter.codePointAt(0);
      elements.push(html`<a href="?h=${codepoint}">${letter}</a>`);
      letters = "";
    } else {
      letters += letter;
    }
  }
  if (letters !== "") elements.push(letters);
  return html`${elements}`;
}
function annotateList(entries) {
  if (!entries) return null;
  const li = entries.map((item) => {
    const annotatedText = annotate(item);
    return html`<li>${annotatedText}</li>`;
  });
  return html`<ul>${li}</ul>`;
}

// js/applets/hzdict/CedictResults.js
var CedictResults = class extends preact_exports.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: []
    };
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  render() {
    const cedictResults = this.props.results.filter((result) => result.src === "cedict");
    const resultElements = cedictResults.map((entry) => {
      const pinyin = PinyinString.of(entry.p) ?? entry.p;
      const definitions = entry.m;
      let hanzi = null;
      let definition = null;
      if (entry.s === entry.t) {
        hanzi = html`
                    <span>
                        ${annotate(entry.s)}
                    </span>
                `;
      } else {
        hanzi = html`
                    <span>
                        ${annotate(entry.s)}
                        [${annotate(entry.t)}]
                    </span>
                `;
      }
      if (definitions.length === 1) {
        definition = definitions[0];
      } else {
        const summary = definitions[0];
        const details = definitions.map((en, index) => html`
                    <li key=${index}>${en}</li>
                `);
        definition = html`
                    <details>
                        <summary>${summary}</summary>
                        <ul>${details}</ul>
                    </details>
                `;
      }
      return html`
                <tr key=${entry.id}>
                    <td>${hanzi}</td>
                    <td>${pinyin.toDiacritics()}</td>
                    <td>${definition}</td>
                </tr>
            `;
    });
    return html`
            <table class="cedict-table">
                <colgroup><col /><col /><col /></colgroup>
                <thead><tr>
                    <th>Hanzi</th>
                    <th>Pinyin</th>
                    <th>Meaning</th>
                </tr></thead>
                <tbody>
                    ${resultElements}
                </tbody>
            </table>
        `;
  }
};

// js/applets/hzdict/UnihanResults.js
var UnihanResults = class extends preact_exports.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: []
    };
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  render() {
    const unihanResults = this.props.results.filter((result) => result.src === "unihan");
    const resultElements = unihanResults.map((entry) => {
      const ja = entry.ja.map((item) => html`<li>${item}</li>`);
      const va = entry.va ? entry.va : [entry.id];
      return html`
                <tr key=${entry.id}>
                    <td>${annotateList(va)}</td>
                    <td>${annotateList(entry.zh)}</td>
                    <td>${annotateList(entry.ja)}</td>
                    <td>${annotateList(entry.ref)}</td>
                    <td>${annotateList(entry.en)}</td>
                </tr>
            `;
    });
    return html`
            <table class="unihan-table">
                <colgroup><col /><col /><col /><col /><col /></colgroup>
                <thead><tr>
                    <th class="en">汉字</th>
                    <th class="en">拼音</th>
                    <th class="en">読み方</th>
                    <th class="en">Ref</th>
                    <th class="en">Meaning</th>
                </tr></thead>
                <tbody>
                    ${resultElements}
                </tbody>
            </table>
        `;
  }
};

// js/applets/hzdict/HzDict.js
var searchParams = new URLSearchParams(window.location.search);
var HzDict = class extends preact_exports.Component {
  #searchTextStore;
  constructor(props) {
    super(props);
    this.#searchTextStore = stores_exports.PrimitiveStore.of("");
    this.state = {
      results: []
    };
  }
  async #search(query, mode) {
    const src = [];
    const pinyin = PinyinString.of(query);
    switch (mode) {
      case "ce":
        src.push("cedict");
        break;
      case "hz":
        src.push("unihan");
        break;
      default:
        return false;
    }
    const searchOptions = {
      src,
      hanzi: query,
      pinyin: pinyin ? pinyin.toString() : null
    };
    const results = await rpc("hzdict.search", searchOptions);
    this.setState({ results });
    return true;
  }
  #initialise = async (event) => {
    const chineseQuery = searchParams.get("z");
    const hanziQuery = searchParams.get("h");
    if (chineseQuery) {
      this.#searchTextStore.setValue(chineseQuery);
      this.#search(chineseQuery, "ce");
    } else if (hanziQuery) {
      this.#search(String.fromCodePoint(hanziQuery), "hz");
    }
  };
  componentDidMount() {
    this.#initialise();
    clipboard_exports.pasteListenerList.add(this.#onPaste);
  }
  componentWillUnmount() {
    clipboard_exports.pasteListenerList.remove(this.#onPaste);
  }
  #onSearchChinese = async (event) => {
    const text = this.#searchTextStore.getValue().trim();
    url_exports.reload({ z: text });
  };
  #onClickHanzi = async (event) => {
    const hanzi = event.target.textContent.trim();
    url_exports.reload({ h: hanzi });
  };
  #onClearSearch = async (event) => {
    this.#searchTextStore.resetValue("");
    this.setState({ results: [] });
  };
  #onPaste = async (event) => {
    const text = event.text;
    url_exports.reload({ z: text });
  };
  render() {
    styles_exports.loadCss({ path: `js/applets/hzdict/hzdict.css`, content: `.hzdict {
    margin-top: 1rem;

    table {
        table-layout: fixed;
        width: 40rem;
        border-collapse: collapse;

        & th, & td {
            text-align: left;
            vertical-align: top;
            padding: 0.25rem;

            & details {
                margin: 0;
            }
        }

        & ul {
            margin: 0;
            padding: 0;
        }

        & ul li {
            list-style-type: none;
            margin: 0;
            padding: 0;
        }
    }

    & table.cedict-table {
        & col:nth-child(1) { width: 20%; }
        & col:nth-child(2) { width: 20%; }
        & col:nth-child(3) { width: 60%; }
    }

    & table.unihan-table {
        & col:nth-child(1) {
            width: 4rem;
        }
        & col:nth-child(2) {
            width: 4rem;
        }
        & col:nth-child(3) {
            width: 8rem;
        }
        & col:nth-child(4) {
            width: 10rem;
        }
        & col:nth-child(5) {
            font-size: small;
            width: 14rem;
        }
    }

    a {
        font-style: normal;
        text-decoration: none;
        color: var(--pico-primary);
        cursor: pointer;
    }

    tr {
        border-bottom: 1px solid var(--pico-secondary-border);
        text-align: left;
    }
}
` });
    const results = this.state.results;
    const unihanResults = results.unihan ? html`
            <${UnihanResults} results=${results.unihan} />
        ` : null;
    const cedictResults = results.cedict ? html`
            <${CedictResults} results=${results.cedict} />
        ` : null;
    return html`
            <div class="pico hzdict">
                <fieldset role="group">
                    <${TextInput} store=${this.#searchTextStore} onSubmit=${this.#onSearchChinese} autofocus=${true} />
                    <${Button} icon="x-circle" onClick=${this.#onClearSearch} />
                </fieldset>
                ${unihanResults}
                ${cedictResults}
            </div>
        `;
  }
};

// js/applets/hzdict/entrypoint.js
var entrypoint_default = HzDict;
export {
  entrypoint_default as default
};
