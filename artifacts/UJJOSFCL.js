import {
  ClassNames,
  Url,
  globalEnv,
  html,
  md5,
  preact_exports,
  styles_exports
} from "./chunks/MU5EPMOO.js";
import "./chunks/U4FYQBOV.js";

// js/applets/crossword/Cell.js
var Cell = class {
  constructor(x, y, name) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.ordinal = null;
  }
};

// js/applets/crossword/Question.js
var Question = class {
  constructor(id, pojo, isVertical) {
    this.id = id;
    this.x = pojo.x;
    this.y = pojo.y;
    this.ordinal = pojo.ordinal;
    this.length = pojo.length;
    this.isVertical = isVertical;
    this.clue = pojo.clue;
    this.check = pojo.check;
    this.cellNames = [];
  }
};

// js/applets/crossword/Board.js
var Board = class {
  constructor(crossword) {
    this.width = crossword.width;
    this.height = crossword.height;
    this.cellsByAddr = new Array(this.width * this.height).fill(null);
    this.cellsByName = {};
    this.questions = [];
    for (const pojo of crossword.across) {
      const question = new Question(this.questions.length, pojo, false);
      this.questions.push(question);
    }
    for (const pojo of crossword.down) {
      const question = new Question(this.questions.length, pojo, true);
      this.questions.push(question);
    }
    this.questions.sort((a, b) => a.ordinal - b.ordinal);
    for (const question of this.questions) {
      this.writeQuestion(question);
    }
  }
  #getOrCreateCell(x, y) {
    const addr = y * this.width + x;
    if (!this.cellsByAddr[addr]) {
      const name = `${y}`.padStart(2, "0") + `${x}`.padStart(2, "0");
      const cell = new Cell(x, y, name);
      this.cellsByAddr[addr] = cell;
      this.cellsByName[name] = cell;
    }
    return this.cellsByAddr[addr];
  }
  getCellByName(name) {
    return this.cellsByName[name];
  }
  getCell(x, y) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return this.cellsByAddr[y * this.width + x];
    } else {
      return null;
    }
  }
  writeQuestion(question) {
    let x = question.x;
    let y = question.y;
    this.#getOrCreateCell(x, y).ordinal = question.ordinal;
    for (let i = 0; i < question.length; i += 1) {
      let cell = this.#getOrCreateCell(x, y);
      question.cellNames.push(cell.name);
      x += question.isVertical ? 0 : 1;
      y += question.isVertical ? 1 : 0;
    }
  }
};

// js/applets/crossword/CrosswordGrid.js
var CrosswordGrid = class extends preact_exports.Component {
  #inputRefs = {};
  #isVertical = true;
  constructor(props) {
    super(props);
    this.state = {
      cellLetters: {},
      correctCells: {}
    };
  }
  async #loadCrossword(url) {
    url = Url.from(url);
    const crossword = await url.fetchJson();
    this.setState({
      letters: {},
      correctCells: {}
    });
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  #getCellLetters() {
    const results = {};
    for (const [cellName, inputElement] of Object.entries(this.#inputRefs)) {
      results[cellName] = inputElement.value;
    }
    return results;
  }
  #getCorrectCells(cellLetters) {
    const board = this.props.board;
    const correct = {};
    for (const question of board.questions) {
      let answer = "";
      for (const cellName of question.cellNames) {
        answer += cellLetters[cellName] ?? " ";
      }
      if (!answer.includes(" ")) {
        const actual = md5(answer);
        const expected = question.check;
        console.info(`Checking answer: ${answer} ${actual} vs ${expected}`);
        if (actual === expected) {
          for (const cellName of question.cellNames) {
            correct[cellName] = true;
          }
        }
      }
    }
    return correct;
  }
  #moveTo(x, y) {
    const board = this.props.board;
    const nextCell = board.getCell(x, y);
    if (!nextCell) return false;
    this.#inputRefs[nextCell.name]?.focus();
    return true;
  }
  #move(x, y, step, isVertical = void 0) {
    if (isVertical === void 0) {
      isVertical = this.#isVertical;
    }
    let ok = true;
    if (isVertical) {
      ok = this.#moveTo(x, y + step);
    } else {
      ok = this.#moveTo(x + step, y);
    }
    this.#isVertical = ok ? isVertical : !isVertical;
    return ok;
  }
  #onInputKeyDown = (event) => {
    event.preventDefault();
    const key = event.key;
    const board = this.props.board;
    const name = event.target.name;
    const cell = board.getCellByName(name);
    if (key === "Delete") {
      this.#move(cell.x, cell.y, 1);
      event.target.value = " ";
    } else if (key === "Backspace") {
      this.#move(cell.x, cell.y, -1);
      event.target.value = " ";
    } else if (key === "ArrowUp") {
      this.#move(cell.x, cell.y, -1, true);
    } else if (key === "ArrowDown") {
      this.#move(cell.x, cell.y, 1, true);
    } else if (key === "ArrowLeft") {
      this.#move(cell.x, cell.y, -1, false);
    } else if (key === "ArrowRight") {
      this.#move(cell.x, cell.y, 1, false);
    } else if (key.length === 1) {
      const letter = key.toUpperCase();
      if (!this.#move(cell.x, cell.y, 1)) {
        this.#move(cell.x, cell.y, 1);
      }
      event.target.value = letter;
    }
    const cellLetters = this.#getCellLetters();
    const correctCells = this.#getCorrectCells(cellLetters);
    this.setState({ cellLetters, correctCells });
  };
  #renderCell(key, cell) {
    const cellLetters = this.state.cellLetters;
    const correctCells = this.state.correctCells;
    let classNames = new ClassNames("letter", "handwritten");
    if (this.state.correctCells[cell.name]) {
      classNames.add("correct");
    }
    const setInputRef = (node) => {
      if (!node) return;
      const cellName = node.getAttribute("name");
      this.#inputRefs[cellName] = node;
    };
    const ordinal = cell.ordinal ? html`
            <span class="ordinal">${cell.ordinal}</span>
        ` : null;
    return html`
            <td key=${cell.name}>
                ${ordinal}
                <input
                    ref=${setInputRef}
                    class=${classNames.toString()}
                    type="text"
                    name=${cell.name}
                    value=${cellLetters[cell.name] ?? " "}
                    maxlength="1"
                    onKeyDown=${this.#onInputKeyDown}
                />
            </td>
        `;
  }
  render() {
    styles_exports.loadCss({ path: `js/applets/crossword/crossword.css`, content: `div.crossword {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    padding: 1rem;

    div.keyboard {
        text-align: center;
    }

    table {
        border-collapse: collapse;
        background: black;
    }

    td {
        position: relative;
        text-align: center;
        vertical-align: middle;
        margin: 0;
        padding: 0;

        & span.ordinal {
            position: absolute;
            top: 0;
            left: 0;
            padding: 2px;
            font-size: 50%;
            z-index: 10;
        }

        & input.letter {
            font-family: hand;
            display: block;
            width: 2rem;
            height: 2rem;
            color: #000;
            margin: 0;
            border: 1px solid black;
            background-color: #fff;
            padding: 0;
            text-align: center;
            caret-color: transparent;
            outline: none;
            transition: background-color 1s ease-in-out;

            &:focus {
                outline: 1px solid red;
                animation: flash 1s infinite ease-in-out;
            }
        }

        & input.letter.correct {
            background-color: #cfc;
        }
    }

    div.clue-grid {
        margin-top: 1rem;
        display: grid;
        grid-template-columns: 1fr 1fr; /* \u4E24\u5217\u5404\u5360 50% */
        gap: 1rem; /* \u53EF\u9009\uFF1A\u8BBE\u7F6E\u4E24\u5217\u4E4B\u95F4\u7684\u95F4\u8DDD */
    }

    div.clue-pane {
        border: 1px solid white;
        font-size: small;
    }

    div.clue-heading {
        font-weight: bold;
        margin-bottom: 1rem;
        text-align: center;
    }

    ol li::marker {
        font-weight: bold;
    }

    span.ordinal {
        font-weight: bold;
    }

    @media print {
        div.crossword-grid { break-inside: avoid; }
        div.clue-grid { break-inside: avoid; }
    }
}
` });
    this.#inputRefs = {};
    const board = this.props.board;
    if (!board) return null;
    const rows = [];
    for (let y = 0; y < board.height; y += 1) {
      const row = [];
      for (let x = 0; x < board.width; x += 1) {
        const key = `${x},${y}`;
        const cell = board.getCell(x, y);
        const element = cell ? this.#renderCell(key, cell) : html`
                    <td key=${key}></td>
                `;
        row.push(element);
      }
      rows.push(html`
                <tr>${row}</tr>
            `);
    }
    return html`
            <div class="crossword-grid">
                <table>${rows}</table>
            </div>
        `;
  }
};

// js/applets/crossword/Crossword.js
var Crossword = class extends preact_exports.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: null
    };
  }
  async #loadCrossword(filepath) {
    const crossword = await globalEnv.files.loadJson(filepath);
    const board = new Board(crossword);
    this.setState({ board });
  }
  componentDidMount() {
    this.#loadCrossword(this.props["json-file"]);
  }
  componentWillUnmount() {
  }
  render() {
    styles_exports.loadCss({ path: `js/applets/crossword/crossword.css`, content: `div.crossword {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    padding: 1rem;

    div.keyboard {
        text-align: center;
    }

    table {
        border-collapse: collapse;
        background: black;
    }

    td {
        position: relative;
        text-align: center;
        vertical-align: middle;
        margin: 0;
        padding: 0;

        & span.ordinal {
            position: absolute;
            top: 0;
            left: 0;
            padding: 2px;
            font-size: 50%;
            z-index: 10;
        }

        & input.letter {
            font-family: hand;
            display: block;
            width: 2rem;
            height: 2rem;
            color: #000;
            margin: 0;
            border: 1px solid black;
            background-color: #fff;
            padding: 0;
            text-align: center;
            caret-color: transparent;
            outline: none;
            transition: background-color 1s ease-in-out;

            &:focus {
                outline: 1px solid red;
                animation: flash 1s infinite ease-in-out;
            }
        }

        & input.letter.correct {
            background-color: #cfc;
        }
    }

    div.clue-grid {
        margin-top: 1rem;
        display: grid;
        grid-template-columns: 1fr 1fr; /* \u4E24\u5217\u5404\u5360 50% */
        gap: 1rem; /* \u53EF\u9009\uFF1A\u8BBE\u7F6E\u4E24\u5217\u4E4B\u95F4\u7684\u95F4\u8DDD */
    }

    div.clue-pane {
        border: 1px solid white;
        font-size: small;
    }

    div.clue-heading {
        font-weight: bold;
        margin-bottom: 1rem;
        text-align: center;
    }

    ol li::marker {
        font-weight: bold;
    }

    span.ordinal {
        font-weight: bold;
    }

    @media print {
        div.crossword-grid { break-inside: avoid; }
        div.clue-grid { break-inside: avoid; }
    }
}
` });
    const board = this.state.board;
    if (!board) return null;
    const across = [];
    const down = [];
    for (const question of board.questions) {
      const clueList = question.isVertical ? down : across;
      clueList.push(html`
                <li value=${question.ordinal}>
                    ${question.clue}
                </li>
            `);
    }
    return html`
            <div class="crossword">
                <${CrosswordGrid} board=${this.state.board} />
                <div class="pico clue-grid">
                    <div class="clue-pane">
                        <div class="clue-heading">Across</div>
                        <ol class="clue-list">${across}</ol>
                    </div>
                    <div class="clue-pane">
                        <div class="clue-heading">Down</div>
                        <ol class="clue-list">${down}</ol>
                    </div>
                </div>
            </div>
        `;
  }
};

// js/applets/crossword/entrypoint.js
var entrypoint_default = Crossword;
export {
  entrypoint_default as default
};
