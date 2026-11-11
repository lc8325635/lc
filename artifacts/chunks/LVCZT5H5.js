import {
  __export
} from "./U4FYQBOV.js";

// js/lang/error/UserCodeError.js
var UserCodeError = class extends Error {
  constructor(message, ref = null) {
    super(message);
    this.name = "UserCodeError";
    this.ref = ref;
  }
  toString() {
    return `Program error ${this.ref}: ${this.message}`;
  }
};

// js/lang/error/index.js
var error_exports = {};
__export(error_exports, {
  Ref: () => Ref,
  UserCodeError: () => UserCodeError
});

// js/lang/error/Ref.js
var Ref = class {
  constructor(filename, lineno) {
    this.filename = filename;
    this.lineno = lineno;
  }
  toString() {
    return `${this.filename} (line ${this.lineno})`;
  }
};

// js/lang/analysis.js
function inferFromFilename(filename) {
  if (filename.endsWith(".py")) return "python";
  if (filename.endsWith(".cie")) return "cie";
  if (filename.endsWith(".html")) return "html";
  throw new Error(`Unsupported language: ${filename}.`);
}

export {
  Ref,
  UserCodeError,
  error_exports,
  inferFromFilename
};
