import{C as g,J as d,K as w,b as u,c as a,g as s,i as x,l as b,p as z,w as y}from"./chunks/2F6KTMXK.js";import"./chunks/UBMAP5WQ.js";function k(i){let n=i.codePointAt(0);return n>=19968&&n<=40959||n>=13312&&n<=19903||n>=63744&&n<=64255||n>=131072}function h(i){let n=[],e="";if(typeof i!="string")throw new Error(`Invalid string: ${i}`);for(let t of i)if(k(t)){e!==""&&n.push(e);let r=t.codePointAt(0);n.push(s`<a href="?h=${r}">${t}</a>`),e=""}else e+=t;return e!==""&&n.push(e),s`${n}`}function c(i){if(!i)return null;let n=i.map(e=>{let t=h(e);return s`<li>${t}</li>`});return s`<ul>${n}</ul>`}var p=class extends a.Component{constructor(n){super(n),this.state={results:[]}}componentDidMount(){}componentWillUnmount(){}render(){let e=this.props.results.filter(t=>t.src==="cedict").map(t=>{let r=d.of(t.p)??t.p,o=t.m,l=null,$=null;if(t.s===t.t?l=s`
                    <span>
                        ${h(t.s)}
                    </span>
                `:l=s`
                    <span>
                        ${h(t.s)}
                        [${h(t.t)}]
                    </span>
                `,o.length===1)$=o[0];else{let S=o[0],C=o.map((P,R)=>s`
                    <li key=${R}>${P}</li>
                `);$=s`
                    <details>
                        <summary>${S}</summary>
                        <ul>${C}</ul>
                    </details>
                `}return s`
                <tr key=${t.id}>
                    <td>${l}</td>
                    <td>${r.toDiacritics()}</td>
                    <td>${$}</td>
                </tr>
            `});return s`
            <table class="cedict-table">
                <colgroup><col /><col /><col /></colgroup>
                <thead><tr>
                    <th>Hanzi</th>
                    <th>Pinyin</th>
                    <th>Meaning</th>
                </tr></thead>
                <tbody>
                    ${e}
                </tbody>
            </table>
        `}};var m=class extends a.Component{constructor(n){super(n),this.state={results:[]}}componentDidMount(){}componentWillUnmount(){}render(){let e=this.props.results.filter(t=>t.src==="unihan").map(t=>{let r=t.ja.map(l=>s`<li>${l}</li>`),o=t.va?t.va:[t.id];return s`
                <tr key=${t.id}>
                    <td>${c(o)}</td>
                    <td>${c(t.zh)}</td>
                    <td>${c(t.ja)}</td>
                    <td>${c(t.ref)}</td>
                    <td>${c(t.en)}</td>
                </tr>
            `});return s`
            <table class="unihan-table">
                <colgroup><col /><col /><col /><col /><col /></colgroup>
                <thead><tr>
                    <th class="en">汉字</th>
                    <th class="en">拼音</th>
                    <th class="en">読み方</th>
                    <th class="en">Ref</th>
                    <th class="en">Meaning</th>
                </tr></thead>
                <tbody>
                    ${e}
                </tbody>
            </table>
        `}};var v=new URLSearchParams(window.location.search),f=class extends a.Component{#t;constructor(n){super(n),this.#t=z.PrimitiveStore.of(""),this.state={results:[]}}async#n(n,e){let t=[],r=d.of(n);switch(e){case"ce":t.push("cedict");break;case"hz":t.push("unihan");break;default:return!1}let o={src:t,hanzi:n,pinyin:r?r.toString():null},l=await w("hzdict.search",o);return this.setState({results:l}),!0}#s=async n=>{let e=v.get("z"),t=v.get("h");e?(this.#t.setValue(e),this.#n(e,"ce")):t&&this.#n(String.fromCodePoint(t),"hz")};componentDidMount(){this.#s(),g.pasteListenerList.add(this.#e)}componentWillUnmount(){g.pasteListenerList.remove(this.#e)}#i=async n=>{let e=this.#t.getValue().trim();u.reload({z:e})};#r=async n=>{let e=n.target.textContent.trim();u.reload({h:e})};#o=async n=>{this.#t.setValue(""),this.setState({results:[]})};#e=async n=>{let e=n.text;u.reload({z:e})};render(){x.loadCss({path:"js/applets/hzdict/hzdict.css",content:`.hzdict {
    margin-top: 1rem;

    table {
        table-layout: fixed;
        width: 40rem;
        border-collapse: collapse;

        & th, & td {
            text-align: left;
            vertical-align: top;
            padding: 0.25rem;

            & details {
                margin: 0;
            }
        }

        & ul {
            margin: 0;
            padding: 0;
        }

        & ul li {
            list-style-type: none;
            margin: 0;
            padding: 0;
        }
    }

    & table.cedict-table {
        & col:nth-child(1) { width: 20%; }
        & col:nth-child(2) { width: 20%; }
        & col:nth-child(3) { width: 60%; }
    }

    & table.unihan-table {
        & col:nth-child(1) {
            width: 4rem;
        }
        & col:nth-child(2) {
            width: 4rem;
        }
        & col:nth-child(3) {
            width: 8rem;
        }
        & col:nth-child(4) {
            width: 10rem;
        }
        & col:nth-child(5) {
            font-size: small;
            width: 14rem;
        }
    }

    a {
        font-style: normal;
        text-decoration: none;
        color: var(--pico-primary);
        cursor: pointer;
    }

    tr {
        border-bottom: 1px solid var(--pico-secondary-border);
        text-align: left;
    }
}
`});let n=this.state.results,e=n.unihan?s`
            <${m} results=${n.unihan} />
        `:null,t=n.cedict?s`
            <${p} results=${n.cedict} />
        `:null;return s`
            <div class="pico hzdict">
                <fieldset role="group">
                    <${y} store=${this.#t} onSubmit=${this.#i} />
                    <${b} icon="x-circle" onClick=${this.#o} />
                </fieldset>
                ${e}
                ${t}
            </div>
        `}};var q=f;export{q as default};
