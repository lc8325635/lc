import{F as u,a as r,e as n,q as c,r as d,t as h,v as p,z as m}from"./chunks/CG5B4ACS.js";import"./chunks/UBMAP5WQ.js";var o=class extends r.Component{#t;constructor(i){super(i),this.#t=m.PrimitiveStore.of(""),this.state={results:[]}}componentDidMount(){}componentWillUnmount(){}#n=async i=>{let t=this.#t.getValue().trim(),e=c.of(t);if(console.info(`Searching for pinyin: ${e}`),t.length>0){let s={hanzi:t,pinyin:e?e.toString():null,meaning:t},l=await d("hzdict.search",s);this.setState({results:l})}else this.setState({results:[]})};#s=async i=>{this.#t.setValue(""),this.setState({results:[]})};render(){h.loadCss({path:"js/applets/hzdict/hzdict.css",content:`.hzdict {
    margin-top: 1rem;

    & table.cedict-table {
        table-layout: fixed;
        width: 40rem;
        border-collapse: collapse;

        & col:nth-child(1) { width: 20%; }
        & col:nth-child(2) { width: 20%; }
        & col:nth-child(3) { width: 60%; }

        & th, & td {
            vertical-align: middle;

            & details {
                margin: 0;
            }
        }
    }

    & .sihz {
        color: var(--pico-color);
    }

    & .trhz {
        color: var(--pico-secondary);
    }

    & .en {
        font-size: small;
    }

    & .zh, & .en {
        border-bottom: 1px solid var(--pico-secondary-border);
        text-align: left;
    }
}
`});let i=this.state.results.map(t=>{let e=c.of(t.p)??t.p,s=t.m,l=null,a=null;if(t.s===t.t?l=n`
                    <span class="sihz">${t.s}</span>
                `:l=n`
                    <details>
                        <summary>${t.s}</summary>
                        <div class="trhz">${t.t}</div>
                    </details>
                `,s.length===1)a=s[0];else{let f=s[0],$=s.map((g,z)=>n`
                    <li key=${z}>${g}</li>
                `);a=n`
                    <details>
                        <summary>${f}</summary>
                        <ul>${$}</ul>
                    </details>
                `}return n`
                <tr key=${t.id}>
                    <td class="zh">${l}</td>
                    <td class="en">${e.toDiacritics()}</td>
                    <td class="en">${a}</td>
                </tr>
            `});return n`
            <div class="pico hzdict">
                <fieldset role="group">
                    <${u} store=${this.#t} onSubmit=${this.#n} />
                    <${p} icon="x-circle" onClick=${this.#s} />
                </fieldset>
                <table class="cedict-table">
                    <colgroup><col /><col /><col /></colgroup>
                    <thead><tr>
                        <th class="en">Hanzi</th>
                        <th class="en">Pinyin</th>
                        <th class="en">Meaning</th>
                    </tr></thead>
                    <tbody>
                        ${i}
                    </tbody>
                </table>
            </div>
        `}};var C=o;export{C as default};
