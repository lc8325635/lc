import {
  dom_exports,
  globalEnv,
  onReady,
  preact_exports,
  string_exports,
  styles_exports,
  url_exports
} from "./chunks/IM4XGPPB.js";
import "./chunks/U4FYQBOV.js";

// js/slideshow/Slideshow.js
var searchParams = new URLSearchParams(window.location.search);
var Slideshow = class {
  #rootElement = null;
  #slideDeck = null;
  #slideContainer = null;
  #slideNav = null;
  #numSlides = 0;
  #currentSlide = 0;
  constructor(element2) {
    this.#rootElement = element2;
    this.#slideContainer = dom_exports.create(`<div class="slides-container" tabindex="0"></div>`);
    this.#slideNav = dom_exports.create(`<div class="slide-nav"></div>`);
    dom_exports.clear(element2);
    element2.append(this.#slideContainer);
    element2.append(this.#slideNav);
    this.#slideContainer.addEventListener("keydown", this.#onKeyDown);
    element2.classList.remove("hidden");
    this.refresh();
  }
  setContent(content) {
    this.#slideContainer.innerHTML = content;
    this.refresh();
  }
  refresh() {
    this.#currentSlide = 0;
    this.#numSlides = 0;
    for (const child of this.#rootElement.querySelectorAll("section")) {
      this.#slideContainer.append(child);
      this.#numSlides += 1;
    }
    this.#substitutePageVariables();
  }
  remove() {
    dom_exports.clear(element);
  }
  #substitutePageVariables() {
    for (const element2 of this.#slideContainer.querySelectorAll("[data-pageVar]")) {
      const key = element2.getAttribute("data-pageVar");
      element2.textContent = globalEnv.pageVariables.getValue(key);
    }
  }
  #onKeyDown = (event) => {
    event.preventDefault();
    console.info(event);
    if (event.key === "ArrowRight") this.next();
    if (event.key === "ArrowLeft") this.prev();
    if (event.key === "f" || event.key === "F") this.toggleFullscreen();
  };
  #setSlide(currentSlide) {
    this.#currentSlide = Math.max(0, Math.min(currentSlide, this.#numSlides - 1));
    const slideTransform = `transform: translateX(-${this.#currentSlide * 100}%);`;
    this.#slideContainer.setAttribute("style", slideTransform);
  }
  next() {
    this.#setSlide(this.#currentSlide + 1);
  }
  prev() {
    this.#setSlide(this.#currentSlide - 1);
  }
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
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
