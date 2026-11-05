import {
  Clock,
  TabSelector,
  TextInput,
  TimeOfDay,
  html,
  preact_exports,
  stores_exports,
  styles_exports,
  time_exports
} from "./chunks/IM4XGPPB.js";
import "./chunks/U4FYQBOV.js";

// js/applets/lesson-starter/LessonStarter.js
var LessonStarter = class extends preact_exports.Component {
  #intervalId;
  #titleStore;
  #lessonTimes;
  constructor(props) {
    super(props);
    this.state = {
      nextLessonTime: null,
      title: ""
    };
    this.#titleStore = stores_exports.PrimitiveStore.of("");
    this.#lessonTimes = [
      "8:00",
      "9:00",
      "10:15",
      "11:15",
      "13:35",
      "14:35",
      "20:00"
    ].map(TimeOfDay.parseTime);
  }
  componentDidMount() {
    const now = TimeOfDay.now();
    this.setState({
      nextLessonTime: now.roundUp(...this.#lessonTimes)
    });
  }
  componentWillUnmount() {
  }
  render() {
    styles_exports.loadCss({ path: `js/applets/lesson-starter/lesson-starter.css`, content: `.lesson-starter {
    display: flex;
    flex-flow: column nowrap;
    align-items: stretch;
    justify-content: stretch;
    height: 100vh;

    .lesson-countdown {
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
    }

    .control-panel {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: stretch;
    }

    .date {
        font-size: 150%;
        text-align: right;
    }

    .title {
        font-size: 300%;
        text-align: center;
        text-decoration: underline;
    }
}
` });
    const nextLessonTime = this.state.nextLessonTime;
    const countdownTime = nextLessonTime ? nextLessonTime.toSeconds() : null;
    const dateText = time_exports.strftime("%A, %d %B, %Y");
    const tabs = ["Starter", "Timer"];
    return html`
            <div class="lesson-starter">
                <div class="lesson-countdown">
                    <div class="date">
                        ${dateText}
                    </div>
                    <div class="title">
                        ${this.state.title}
                    </div>
                    <${Clock} time=${countdownTime} mode="countdown" />
                    <details name="Settings">
                        <${TextInput} store=${this.#titleStore} />
                    </details>
                </div>

                <div class="timer">
                </div>

                <div class="control-panel">
                    <${TabSelector} tabs=${tabs} />
                </div>
            </div>
        `;
  }
};

// js/applets/lesson-starter/entrypoint.js
var entrypoint_default = LessonStarter;
export {
  entrypoint_default as default
};
