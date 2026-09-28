import{a as m,e as c,f as p,g as x,n as y}from"./chunks/OBVZ5JR7.js";import"./chunks/UBMAP5WQ.js";var S=function(l){return l.trim().toUpperCase()},u=class{constructor(t,s,e=void 0){this.text=t,this.payload=s,e===void 0&&(e=p.extractWords(t,3)),this.keywords=e.map(S),this.keywords.sort()}match(t){let s=0;t=t.map(S);for(let e of t)s+=this.uid===e?1e3:this.findBestMatch(e);return s}findBestMatch(t){let s=this.keywords.length-1,e=0;for(;e<s&&t>this.keywords[e];)e+=1;let r=this.keywords[e],n=Math.min(t.length,r.length);for(let i=0;i<n;i+=1)if(t[i]!==r[i])return i;return n}toString(){return this.text}};var d=class{constructor(t,s){this.score=t,this.candidate=s}};var h=class extends m.Component{#e;#t;constructor(t){super(t),this.state={results:[]}}#s(t="",s=20){let e=[],r=p.splitWs(t);for(let n of this.props.candidates){let i=n.match(r);i>0&&e.push(new d(i,n))}if(e.length>0){let n=Math.min(e.length,s);e.sort((o,a)=>a.score-o.score),e=e.slice(0,n);let g=e[0].score/2;e=e.filter(function(o){return o.score>g})}this.setState({results:e})}render(){let t=o=>o.preventDefault(),s=this.props.onSelect,e=o=>this.#t=o,r=o=>{this.setState({results:[]})},n=o=>{if(o.key==="Enter"){let a=this.state.results;a.length>0&&s(a[0].candidate)}},i=o=>{let a=this.#t.value??"";this.#s(a)},g=this.state.results.map(o=>{let a=o.candidate;return c`<li><a href="#" onClick=${w=>{w.preventDefault(),s(a)}}>${a.toString()}</a></li>`});return c`
            <form role="group" onSubmit=${t} onReset=${r} >
                <input type="text" ref=${e} onKeyDown=${n} onInput=${i} />
                <input type="reset" value="Clear" />
            </form>
            <ul>${g}</ul>
        `}};var k=new URLSearchParams(window.location.search);var f=class extends m.Component{constructor(t){super(t),this.state={directory:[],candidates:[]},this.loadEntries()}async loadEntries(){let s=await y.from(this.props.src).fetchJson(),e=[];for(let r of s){let n=new u(r.txt,r.url);e.push(n)}this.setState({directory:s,candidates:e})}#e=async t=>{x.gotoPage(t.payload)};componentDidMount(){}componentWillUnmount(){}#t(){let t=[];for(let s of this.state.directory)if((s.tst??0)>0){let r=x.resolve(s.url);t.push(c`
                    <li key=${r}><a href=${r}>${s.txt}</a></li>
                `)}return c`
            <details name="Testing">
                <ul>${t}</li>
            </details>`}render(){let t=k.has("t")?this.#t():null;return c`
            <div class="page-search pico">
                <${h} candidates=${this.state.candidates} onSelect=${this.#e} />
                ${t}
            </div>
        `}};var Y=f;export{Y as default};
