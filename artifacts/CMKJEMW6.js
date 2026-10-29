import{D as m,H as n,c as s,g as o,i,p as l,w as r,y as a,z as c}from"./chunks/2F6KTMXK.js";import"./chunks/UBMAP5WQ.js";var e=class extends s.Component{#n;#t;#e;constructor(t){super(t),this.state={nextLessonTime:null,title:""},this.#t=l.PrimitiveStore.of(""),this.#e=["8:00","9:00","10:15","11:15","13:35","14:35","20:00"].map(n.parseTime)}componentDidMount(){let t=n.now();this.setState({nextLessonTime:t.roundUp(...this.#e)})}componentWillUnmount(){}render(){i.loadCss({path:"js/applets/lesson-starter/lesson-starter.css",content:`.lesson-starter {
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
`});let t=this.state.nextLessonTime,d=t?t.toSeconds():null,p=m.strftime("%A, %d %B, %Y"),f=["Starter","Timer"];return o`
            <div class="lesson-starter">
                <div class="lesson-countdown">
                    <div class="date">
                        ${p}
                    </div>
                    <div class="title">
                        ${this.state.title}
                    </div>
                    <${c} time=${d} mode="countdown" />
                    <details name="Settings">
                        <${r} store=${this.#t} />
                    </details>
                </div>

                <div class="timer">
                </div>

                <div class="control-panel">
                    <${a} tabs=${f} />
                </div>
            </div>
        `}};var S=e;export{S as default};
