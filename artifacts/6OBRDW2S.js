import{a as i,b as n,g as r,i as m}from"./chunks/ZFPXU6SY.js";import"./chunks/F7WQ4MB3.js";var o=class extends i.Component{constructor(s){super(s);let e=r.splitWs(s.questions).map(t=>Question.fromText(t));this.state={questions:e}}componentDidMount(){}componponentWillUnmount(){}render(){let e=this.state.questions.map(t=>n`
                <li key=${t.qno}>${t.toString()}</li>
            `);return n`
            <div class="question-selector">
                ${e}
            </div>
        `}};m.mountApplet("question-selector",o);
