import {
  Button,
  DialogLayer,
  DialogModel,
  DialogWindow,
  ObjectSelector,
  SelectItem,
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

// js/applets/videpo/Unit.js
var FILENAME_CHARS = new Set("abcdefghijklmnopqrstuvwxyz0123456789-");
var Unit = class {
  constructor(pojo) {
    this.uname = pojo.uname;
    this.mtime = pojo.mtime ?? 0;
    this.title = pojo.title;
    this.category = pojo.category;
    this.thumb = pojo.thumb;
    this.audio = pojo.audio;
    this.video = pojo.video;
    this.baseUrl = this.createUrl();
  }
  createUrl() {
    const uname = this.uname;
    const filenameChars = [];
    for (const letter of uname.toLowerCase()) {
      if (FILENAME_CHARS.has(letter)) {
        filenameChars.push(letter);
      }
    }
    const filename = filenameChars.join("");
    return `${filename.substring(0, 5)}/${uname}`;
  }
  getUrl(filename) {
    return url_exports.resolve(`/videos/videpo/${this.baseUrl}/${filename}`);
  }
  getThumbUrl() {
    return this.getUrl(this.thumb);
  }
  getAudioUrl() {
    if (this.audio && this.audio.length > 0) {
      return this.getUrl(this.audio[0]);
    } else {
      return null;
    }
  }
  getVideoUrl() {
    if (this.video && this.video.length > 0) {
      return this.getUrl(this.video[0]);
    } else {
      return null;
    }
  }
};

// js/applets/videpo/MediaPlayer.js
var MediaPlayer = class extends preact_exports.Component {
  #refs;
  constructor(props) {
    super(props);
    this.#refs = {};
  }
  #onPlay = (event) => {
    this.#refs.audio?.play();
    this.#refs.video?.play();
  };
  #onPause = (event) => {
    this.#refs.audio?.pause();
    this.#refs.video?.pause();
  };
  componentDidMount() {
    if (this.#refs.audio && this.#refs.video) {
      this.#refs.audio.addEventListener("play", this.#onPlay);
      this.#refs.audio.addEventListener("pause", this.#onPause);
    }
  }
  componentWillUnmount() {
    if (this.#refs.audio && this.#refs.video) {
      this.#refs.audio.removeEventListener("play", this.#onPlay);
      this.#refs.audio.removeEventListener("pause", this.#onPause);
    }
  }
  render() {
    const thumb = this.props.thumb;
    const audio = this.props.audio;
    const video = this.props.video;
    if (audio && video) {
      return html`
                <div class="media-player">
                    <video ref=${(node) => this.#refs.video = node} loop muted>
                        <source src=${video} />
                    </video>
                    <audio ref=${(node) => this.#refs.audio = node} loop controls>
                        <source src=${audio} />
                    </audio>
                </div>
            `;
    } else if (audio && thumb) {
      return html`
                <div class="media-player">
                    <img src=${thumb} />
                    <audio ref=${(node) => this.#refs.audio = node} controls>
                        <source src=${audio} />
                    </audio>
                </div>
            `;
    } else if (video && thumb) {
      return html`
                <div class="media-player">
                    <video ref=${(node) => this.#refs.video = node} controls>
                        <source src=${video} />
                    </video>
                </div>
            `;
    } else if (thumb) {
      return html`
                <div class="media-player">
                    <img src=${thumb} />
                </div>
            `;
    }
  }
};

// js/applets/videpo/CategorySelector.js
var CategorySelector = class extends preact_exports.Component {
  #allowAny;
  constructor(props) {
    super(props);
    this.#allowAny = props.allowAny ?? false;
    this.state = {
      categories: []
    };
  }
  async #updateCategories() {
    const store = this.props.store;
    const categoryNames = await rpc("videpo.list_categories");
    categoryNames.sort();
    const categories = [];
    if (this.#allowAny) {
      categories.push(new SelectItem("Any", null));
    }
    for (const name of categoryNames) {
      categories.push(new SelectItem(name, name));
    }
    this.setState({ categories });
    store.setValue(categories[0]);
  }
  componentDidMount() {
    this.#updateCategories();
  }
  componentWillUnmount() {
  }
  render() {
    return html`
            <${ObjectSelector} store=${this.props.store} options=${this.state.categories} />
        `;
  }
};

// js/applets/videpo/AddUnitDialog.js
var AddUnitDialog = class extends preact_exports.Component {
  #urlStore;
  #categoryStore;
  constructor(props) {
    super(props);
    this.#urlStore = stores_exports.PrimitiveStore.of(this.props.url);
    this.#categoryStore = stores_exports.PrimitiveStore.of(this.props.categoryStore);
  }
  render() {
    return html`
            <${DialogWindow} name="add-unit" title="Add unit" buttons="Cancel,OK">
                <${CategorySelector} store=${this.#categoryStore} />
                <label>
                    <span>URL</span>
                    <${TextInput} store=${this.#urlStore} />
                </label>
            <//>
        `;
  }
};

// js/applets/videpo/ModifyUnitsDialog.js
var ModifyUnitsDialog = class extends preact_exports.Component {
  #units;
  #categoryStore;
  constructor(props) {
    super(props);
    this.#categoryStore = props.categoryStore;
    this.state = {
      units: []
    };
  }
  static getDerivedStateFromProps(props, state) {
    const units = Object.values(props.units);
    units.sort((a, b) => a.title.localeCompare(b.title));
    return { units };
  }
  render() {
    const unitList = this.state.units.map((unit) => {
      return html`<li key=${unit.uname}>${unit.title}</li>`;
    });
    return html`
            <${DialogWindow} name="modify-units" title="Modify units" buttons="Delete,Move,Cancel">
                <${CategorySelector} store=${this.#categoryStore} />
                <div class="scrollpane">
                    <ul>${unitList}</ul>
                </div>
            <//>
        `;
  }
};

// js/applets/videpo/Videpo.js
var searchParams = new URLSearchParams(window.location.search);
var Videpo = class extends preact_exports.Component {
  #urlStore;
  #categoryStore;
  #newCategoryStore;
  #searchTextStore;
  #dialogModel;
  constructor(props) {
    super(props);
    this.#urlStore = stores_exports.PrimitiveStore.of("");
    this.#categoryStore = stores_exports.PrimitiveStore.of(null);
    this.#newCategoryStore = stores_exports.PrimitiveStore.of(null);
    this.#searchTextStore = stores_exports.PrimitiveStore.of("");
    this.#dialogModel = new DialogModel();
    this.state = {
      units: {},
      selectedUnits: {},
      activeUnit: null
    };
  }
  async #loadUnit(uname) {
    const pojo = await rpc("videpo.query", uname);
    if (pojo) {
      this.setState({ activeUnit: new Unit(pojo) });
    }
  }
  async #search(start = "") {
    const text = this.#searchTextStore.getValue().toLowerCase();
    const category = this.#categoryStore.getValue();
    console.info(`Search text='${text}' category='${category}' start=${start}`);
    const searchOptions = { start };
    if (text) {
      searchOptions.text = text;
    }
    if (category && category.value) {
      searchOptions.category = category.value;
    }
    console.info(`Search: ${JSON.stringify(searchOptions)}`);
    const unitData = await rpc("videpo.search", searchOptions);
    const units = {};
    for (const pojo of unitData) {
      const unit = new Unit(pojo);
      units[unit.uname] = unit;
    }
    this.setState({
      units,
      selectedUnits: {},
      activeUnit: null
    });
  }
  #initialise = async (event) => {
    const playUname = searchParams.get("p");
    if (playUname) {
      this.#loadUnit(playUname);
    } else {
      this.#search();
    }
  };
  async #addUnit(url, options) {
    console.info(`Add ${url} to category ${options.category}`);
    const uname = await rpc("videpo.schedule", url, options);
    if (uname) {
      console.info(`Added unit: ${uname}`);
    } else {
      await this.#dialogModel.open("add-error");
    }
  }
  #onClearSearch = (event) => {
    this.#searchTextStore.setValue("");
    this.#categoryStore.setValue(0);
    this.#search();
  };
  #onSearch = (event) => {
    this.#search();
  };
  #onChangeCategory = (event) => {
    if (event.oldValue) this.#search();
  };
  #onSearchMore = (event) => {
    let start = "";
    for (const unit of Object.values(this.state.units)) {
      if (unit.uname > start) start = unit.uname;
    }
    this.#search(start + "$");
  };
  #onClickAddUnit = async (event) => {
    const result = await this.#dialogModel.open("add-unit");
    const url = this.#urlStore.getValue();
    const category = this.#newCategoryStore.getValue()?.value;
    if (!category) {
      console.warn(`Couldn't perform action because category selector was not initialised.`);
    } else if (result === 0) {
      this.#addUnit(url, { category });
    }
    console.info(result);
  };
  #onPaste = (event) => {
    const text = event.text;
    this.#urlStore.setValue(event.text);
    this.#onClickAddUnit(text.length < 256 ? text : "");
  };
  #onToggleUnitSelect = (event) => {
    const selectedUnits = Object.assign({}, this.state.selectedUnits);
    const uname = event.target.value;
    const unit = this.state.units[uname];
    if (unit === void 0 || selectedUnits[uname]) {
      delete selectedUnits[uname];
    } else {
      selectedUnits[uname] = unit;
    }
    this.setState({ selectedUnits });
  };
  #onClickModify = async (event) => {
    const unames = Object.keys(this.state.selectedUnits);
    const result = await this.#dialogModel.open("modify-units");
    const category = this.#newCategoryStore.getValue()?.value;
    if (!category) {
      console.warn(`Couldn't perform action because category selector was not initialised.`);
    } else if (result === 1) {
      const result2 = await rpc("videpo.move", category, unames);
      console.info(`Move result: ${result2}`);
    } else if (result === 2) {
      console.info(`Delete units:`);
      const result2 = await rpc("videpo.delete", unames);
      console.info(unames);
    }
    this.#search();
  };
  #onClickRedownload = async (event) => {
    const unit = this.state.activeUnit;
    const result = await this.#dialogModel.open("redownload");
    if (result === 1) {
      this.#addUnit(unit.uname, {
        category: unit.category,
        restart: true
      });
    }
  };
  componentDidMount() {
    this.#initialise();
    clipboard_exports.pasteListenerList.add(this.#onPaste);
    this.#categoryStore.addListener(this.#onChangeCategory);
    this.#searchTextStore.addListener(this.#onSearch);
  }
  componentWillUnmount() {
    this.#searchTextStore.removeListener(this.#onSearch);
    this.#categoryStore.removeListener(this.#onChangeCategory);
    clipboard_exports.pasteListenerList.remove(this.#onPaste);
  }
  #renderPlayer() {
    const unit = this.state.activeUnit;
    const thumbUrl = unit.getThumbUrl();
    const videoUrl = unit.getVideoUrl();
    const audioUrl = unit.getAudioUrl();
    return html`
            <${MediaPlayer} thumb=${thumbUrl} video=${videoUrl} audio=${audioUrl} />
            <div class="pico">
                <${Button} name="Redownload" className="outline secondary" onClick=${this.#onClickRedownload} />
            </div>
        `;
  }
  #renderCatalogue() {
    const units = Object.values(this.state.units);
    units.sort((a, b) => a.title.localeCompare(b.title));
    const unitElements = units.map((unit) => {
      const checked = this.state.selectedUnits[unit.uname] !== void 0;
      let title = unit.title.trim();
      if (title === "") title = unit.uname;
      return html`
                <article key=${unit.uname}>
                    <a href="?p=${unit.uname}">
                        <div class="thumbnail">
                            <img src=${unit.getThumbUrl()} />
                        </div>
                        <footer>
                            <input type="checkbox" value=${unit.uname} onChange=${this.#onToggleUnitSelect} checked=${checked} />
                            <div class="title">${title}</div>
                        </footer>
                    </a>
                </article>
            `;
    });
    return html`
            <div class="media-grid">${unitElements}</div>
            <div class="pico bottom-bar">
                <${Button} name="Modify units" className="outline secondary" onClick=${this.#onClickModify} />
                <div class="result-count">${units.length} results.</div>
                <${Button} name="Search more" className="outline secondary" onClick=${this.#onSearchMore} />
            </div>
        `;
  }
  render() {
    styles_exports.loadCss({ path: `js/applets/videpo/videpo.css`, content: `.videpo {
    margin: 1rem 0 3rem 0;

    nav {
        display: flex;
        flex-flow: row nowrap;
    }

    & .media-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-column-gap: 0.125rem;
        grid-row-gap: 0.125rem;
    }

    & div.thumbnail {
        position: relative;
        text-align: center;

        & img {
            max-height: 5rem;
        }
    }

    & footer {
        display: flex;
        flex-flow: row nowrap;
        align-items: start;
        justify-content: start;
        gap: 0.5rem;
        font-size: small;
    }

    & a {
        display: block;
        text-decoration: none;
    }

    & .title {
        text-align: left;
        text-wrap: balance;
    }

    & div.bottom-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: var(--pico-background-color);
        padding: 1rem;

        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        transition: opacity ease-in-out 0.5s;
        gap: 1rem;

        & .result-count {
            font-size: small;
            text-align: center;
            width: 20rem;
        }
    }

    & .media-player {
        max-width: 100%;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;

        & img {
            width: 100%;
        }

        & video {
            width: 100%;
        }

        & audio {
            width: 100%;
        }
    }

    div.scrollpane {
        flex-grow: 1;
        flex-shrink: 1;
        overflow-y: scroll;
    }
}
` });
    let main = null;
    if (this.state.activeUnit) {
      main = this.#renderPlayer();
    } else {
      main = this.#renderCatalogue();
    }
    return html`
            <div class="videpo">
                <nav class="pico header">
                    <fieldset role="group">
                        <${TextInput} store=${this.#searchTextStore} onSubmit=${this.#onSearch} />
                        <${CategorySelector} store=${this.#categoryStore} allowAny=${true} />
                        <${Button} icon="x-circle" onClick=${this.#onClearSearch} />
                    </fieldset>
                </nav>
                ${main}
                <${DialogLayer} model=${this.#dialogModel}>
                    <${AddUnitDialog} categoryStore=${this.#newCategoryStore} url=${this.#urlStore} />
                    <${ModifyUnitsDialog} categoryStore=${this.#newCategoryStore} units=${this.state.selectedUnits} />

                    <${DialogWindow} name="redownload" title="Are you sure?" buttons="OK,Cancel">
                        If you choose to redownload, the old unit media will be deleted.
                    <//>

                    <${DialogWindow} name="add-error" title="Error adding unit" buttons="OK">
                        An error occurred when adding the URL.
                    <//>
                <//>
            </div>
        `;
  }
};

// js/applets/videpo/entrypoint.js
var entrypoint_default = Videpo;
export {
  entrypoint_default as default
};
