import{H as a,J as c,K as m,a as s,e as o,l as i,o as n,s as l,y as r}from"./chunks/OBVZ5JR7.js";import"./chunks/UBMAP5WQ.js";var e=class extends s.Component{#n;#t;#e;constructor(t){super(t),this.state={nextLessonTime:null,title:""},this.#t=r.PrimitiveStore.of(""),this.#e=["8:00","9:00","10:15","11:15","13:35","14:35","20:00"].map(n.parseTime)}componentDidMount(){let t=n.now();this.setState({nextLessonTime:t.roundUp(...this.#e)})}componentWillUnmount(){}render(){l.loadCss({path:"js/applets/lesson-starter/lesson-starter.css",content:`.lesson-starter {
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
`});let t=this.state.nextLessonTime,d=t?t.toSeconds():null,p=i.strftime("%A, %d %B, %Y"),f=["Starter","Timer"];return o`
            <div class="lesson-starter">
                <div class="lesson-countdown">
                    <div class="date">
                        ${p}
                    </div>
                    <div class="title">
                        ${this.state.title}
                    </div>
                    <${m} time=${d} mode="countdown" />
                    <details name="Settings">
                        <${a} store=${this.#t} />
                    </details>
                </div>

                <div class="timer">
                </div>

                <div class="control-panel">
                    <${c} tabs=${f} />
                </div>
            </div>
        `}};var S=e;export{S as default};
