import {
  Url,
  html,
  preact_exports,
  string_exports,
  url_exports
} from "./chunks/IM4XGPPB.js";
import "./chunks/U4FYQBOV.js";

// js/ui/list-search/SearchCandidate.js
var regularise = function(x) {
  return x.trim().toUpperCase();
};
var SearchCandidate = class {
  constructor(text, payload, keywords = void 0) {
    this.text = text;
    this.payload = payload;
    if (keywords === void 0) {
      keywords = string_exports.extractWords(text, 3);
    }
    this.keywords = keywords.map(regularise);
    this.keywords.sort();
  }
  match(words) {
    let score = 0;
    words = words.map(regularise);
    for (const word of words) {
      score += this.uid === word ? 1e3 : this.findBestMatch(word);
    }
    return score;
  }
  findBestMatch(word) {
    const maxIndex = this.keywords.length - 1;
    let index = 0;
    while (index < maxIndex && word > this.keywords[index]) {
      index += 1;
    }
    const bestMatch = this.keywords[index];
    const length = Math.min(word.length, bestMatch.length);
    for (let i = 0; i < length; i += 1) {
      if (word[i] !== bestMatch[i]) return i;
    }
    return length;
  }
  toString() {
    return this.text;
  }
};

// js/ui/list-search/SearchResult.js
var SearchResult = class {
  constructor(score, candidate) {
    this.score = score;
    this.candidate = candidate;
  }
};

// js/ui/list-search/ListSearch.js
var ListSearch = class extends preact_exports.Component {
  #candidates;
  #searchInputElement;
  constructor(props) {
    super(props);
    this.state = {
      results: []
    };
  }
  #performSearch(query = "", maxResults = 20) {
    let results = [];
    const words = string_exports.splitWs(query);
    for (const candidate of this.props.candidates) {
      const score = candidate.match(words);
      if (score > 0) {
        results.push(new SearchResult(score, candidate));
      }
    }
    if (results.length > 0) {
      const numResults = Math.min(results.length, maxResults);
      results.sort((a, b) => b.score - a.score);
      results = results.slice(0, numResults);
      const maxScore = results[0].score;
      const minScore = maxScore / 2;
      results = results.filter(function(result) {
        return result.score > minScore;
      });
    }
    this.setState({ results });
  }
  render() {
    const onSubmit = (event) => event.preventDefault();
    const onSelect = this.props.onSelect;
    const searchInputRef = (ref) => this.#searchInputElement = ref;
    const onReset = (event) => {
      this.setState({ results: [] });
    };
    const onKeyDown = (event) => {
      if (event.key === "Enter") {
        const results = this.state.results;
        if (results.length > 0) {
          onSelect(results[0].candidate);
        }
      }
    };
    const onInput = (event) => {
      const searchText = this.#searchInputElement.value ?? "";
      this.#performSearch(searchText);
    };
    const searchListItems = this.state.results.map((result) => {
      const candidate = result.candidate;
      const onClick = (event) => {
        event.preventDefault();
        onSelect(candidate);
      };
      return html`<li><a href="#" onClick=${onClick}>${candidate.toString()}</a></li>`;
    });
    return html`
            <form role="group" onSubmit=${onSubmit} onReset=${onReset} >
                <input type="text" ref=${searchInputRef} onKeyDown=${onKeyDown} onInput=${onInput} />
                <input type="reset" value="Clear" />
            </form>
            <ul>${searchListItems}</ul>
        `;
  }
};

// js/applets/page-search/PageSearch.js
var searchParams = new URLSearchParams(window.location.search);
var PageSearch = class extends preact_exports.Component {
  constructor(props) {
    super(props);
    this.state = {
      directory: [],
      candidates: []
    };
    this.loadEntries();
  }
  async loadEntries() {
    const url = Url.from(this.props.entries);
    const directory = await url.fetchJson();
    const candidates = [];
    for (const entry of directory) {
      const candidate = new SearchCandidate(entry.txt, entry.url);
      candidates.push(candidate);
    }
    this.setState({ directory, candidates });
  }
  #onSelect = async (candidate) => {
    url_exports.gotoPage(candidate.payload);
  };
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  #createTestList() {
    const testingLinks = [];
    for (const entry of this.state.directory) {
      const testRank = entry.tst ?? 0;
      if (testRank > 0) {
        const url = url_exports.resolve(entry.url);
        testingLinks.push(html`
                    <li key=${url}><a href=${url}>${entry.txt}</a></li>
                `);
      }
    }
    return html`
            <details name="Testing">
                <ul>${testingLinks}</li>
            </details>`;
  }
  render() {
    const testList = searchParams.has("t") ? this.#createTestList() : null;
    return html`
            <div class="page-search pico">
                <${ListSearch} candidates=${this.state.candidates} onSelect=${this.#onSelect} />
                ${testList}
            </div>
        `;
  }
};

// js/applets/page-search/entrypoint.js
var entrypoint_default = PageSearch;
export {
  entrypoint_default as default
};
