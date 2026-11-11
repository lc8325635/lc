import {
  dom_exports,
  globalEnv,
  onReady,
  preact_exports,
  string_exports,
  styles_exports,
  url_exports,
  windowEvents
} from "./chunks/MU5EPMOO.js";
import "./chunks/U4FYQBOV.js";

// js/slideshow/Slideshow.js
var searchParams = new URLSearchParams(window.location.search);
var Slideshow = class {
  #rootElement = null;
  #slideContainer = null;
  #slideNav = null;
  #slideTemplate = null;
  #slides = [];
  #currentSlideNumber = 0;
  constructor(element2) {
    this.#rootElement = element2;
    this.#rootElement.classList.add("pico");
    this.#slideContainer = dom_exports.create(`<div class="slides-container preview" tabindex="0"></div>`);
    this.#slideNav = dom_exports.create(`
            <div role="group" class="slides-nav">
                <button>Prev</button>
                <button>Fullscreen</button>
                <button>Next</button>
            </div>
        `);
    this.#slideTemplate = dom_exports.create(`<div class="hidden"></div>`);
    dom_exports.clear(element2);
    element2.append(this.#slideNav);
    element2.append(this.#slideContainer);
    element2.append(this.#slideTemplate);
    const buttons = this.#slideNav.querySelectorAll("button");
    buttons[0].addEventListener("click", this.#onClickPrev);
    buttons[1].addEventListener("click", this.#onClickFullscreen);
    buttons[2].addEventListener("click", this.#onClickNext);
    element2.classList.remove("hidden");
    windowEvents.add("onFullScreenChange", this.#onFullscreenChange);
  }
  remove() {
    windowEvents.remove("onFullScreenChange", this.#onFullscreenChange);
    dom_exports.clear(element);
  }
  #setSlideNumber(slideNumber) {
    const numSlides = this.#slides.length;
    if (numSlides === 0) return false;
    slideNumber = Math.max(0, Math.min(slideNumber, numSlides - 1));
    for (let i = 0; i < numSlides; i += 1) {
      const slideElement = this.#slides[i];
      slideElement.classList.toggle("hidden", i !== slideNumber);
    }
    this.#currentSlideNumber = slideNumber;
  }
  setContent(content) {
    this.#slideTemplate.innerHTML = content;
    this.#slides = this.#slideTemplate.querySelectorAll("section");
    dom_exports.clear(this.#slideContainer);
    for (const slideElement of this.#slides) {
      this.#slideContainer.append(slideElement);
      this.#substitutePageVariables(slideElement);
    }
    this.#setSlideNumber(0);
  }
  #substitutePageVariables(slideElement) {
    const varElements = slideElement.querySelectorAll("[data-pageVar]");
    for (const varElement of varElements) {
      const key = varElement.getAttribute("data-pageVar");
      varElement.textContent = globalEnv.pageVariables.getValue(key);
    }
  }
  #onKeyDown = (event) => {
    event.preventDefault();
    if (event.key === "ArrowRight") this.next();
    if (event.key === "ArrowLeft") this.prev();
    if (event.key === "f") this.toggleFullscreen();
  };
  #onClickPrev = (event) => {
    this.#setSlideNumber(this.#currentSlideNumber - 1);
  };
  #onClickNext = (event) => {
    this.#setSlideNumber(this.#currentSlideNumber + 1);
  };
  #onClickFullscreen = (event) => {
    this.toggleFullscreen();
  };
  #onFullscreenChange = (event) => {
    if (!document.fullscreenElement) {
      this.#rootElement.classList.remove("fullscreen");
    } else {
      this.#rootElement.classList.add("fullscreen");
    }
  };
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.#rootElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
};

// js/startup/entrypoint.js
var componentCache = {};
onReady(async function() {
  globalEnv.initialise();
  const env = window.lc;
  const css = env.css ? string_exports.split(env.css, ",") : [];
  for (const path of css) {
    styles_exports.loadStylesheet(path);
  }
  for (const element2 of dom_exports.all("div.slideshow")) {
    const slideshow = new Slideshow(element2);
    const domId = element2.getAttribute("id");
    if (domId) globalEnv.mountIds[domId] = slideshow;
  }
  for (const element2 of dom_exports.all("div.applet")) {
    const json = element2.textContent;
    element2.textContent = "";
    let pojo = null;
    try {
      pojo = JSON.parse(json);
    } catch (e) {
      console.error(`Error parsing configuration: ${e}`);
    }
    if (pojo === null) continue;
    const absUrl = url_exports.resolve(`${pojo.src}/entrypoint.js`);
    console.info(`Loading applet: ${absUrl}`);
    if (componentCache[absUrl] === void 0) {
      const module = await import(absUrl);
      const component2 = module["default"];
      if (component2 !== void 0) {
        componentCache[absUrl] = component2;
      } else {
        componentCache[absUrl] = null;
        console.error(`No default export from module.`);
      }
    }
    const component = componentCache[absUrl];
    if (component) {
      element2.classList.remove("hidden");
      preact_exports.render(preact_exports.h(component, pojo), element2);
    }
  }
});
