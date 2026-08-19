import{C as v,a as u,b as a,c as C,g as h,h as p,i as S,n as $,q as g,s as x,u as k}from"./chunks/ZFPXU6SY.js";import"./chunks/F7WQ4MB3.js";function D(c){return c.toUpperCase()}var m=class{constructor(t,e,s){this.uid=t,this.text=e,this.keywords=s.map(D)}match(t){let e=0;t=t.map(D);for(let s of t)e+=this.uid===s?1e3:this.findBestMatch(s);return e}findBestMatch(t){let e=this.keywords.length-1,s=0;for(;s<e&&t>this.keywords[s];)s+=1;let o=this.keywords[s],n=Math.min(t.length,o.length);for(let r=0;r<n;r+=1)if(t[r]!==o[r])return r;return n}};var d=class{constructor(t,e){this.score=t,this.candidate=e}};var l=class extends u.Component{#e;#o;#s;#t;constructor(t){super(t),this.#e=t.onSelect,this.#o=t.maxResults??5,this.#t={},this.state={results:[]}}componentDidMount(){this.#r()}componentWillUnmount(){}componentDidUpdate(t){this.props.entries!==t.entries&&this.#r()}#r(){this.#s=[];for(let[t,e]of Object.entries(this.props.entries)){let s=new m(t,e.text,e.keywords);this.#s.push(s)}}#n(t=""){let e=[],s=h.splitWs(t);for(let o of this.#s){let n=o.match(s);n>0&&e.push(new d(n,o))}if(e.length>0){let o=Math.min(e.length,this.#o);e.sort((i,w)=>w.score-i.score),e=e.slice(0,o);let r=e[0].score/2;e=e.filter(function(i){return i.score>r})}this.setState({results:e})}render(){let t=r=>r.preventDefault(),e=r=>{this.setState({results:[]})},s=r=>{if(r.key==="Enter"){let i=this.state.results;i.length>0&&this.#e(i[0].candidate.uid)}},o=r=>{let i=this.#t.searchInput?.value??"";this.#n(i)},n=this.state.results.map(r=>{let i=r.candidate;return a`<li><a href="#" onClick=${M=>{M.preventDefault();let y=this.#t.searchInput;y&&(y.value=i.text),this.#e(i.uid)}}>${i.text}</a></li>`});return a`
            <form role="group" onSubmit=${t} onReset=${e} >
                <input type="text" ref=${r=>{this.#t.searchInput=r}} onKeyDown=${s} onInput=${o} />
                <input type="reset" value="Clear" />
            </form>
            <ul>${n}</ul>
        `}};var U=new URLSearchParams(window.location.search);function I(c){let t=c.split(/([\s]|[-/])/g);return t.sort(),t}async function P(c){let t={},s=await $.Remote.from(`artifacts/${c}.json`).fetchJson();for(let o of s){let n=I(o.text);t[o.id]={text:o.text,url:o.url,chk:o.chk,keywords:n}}return t}var f=class extends u.Component{#e;#o;#s;#t;constructor(t){super(t),this.state={entries:[]},this.loadEntries(),this.#e=C(""),this.#o=new g,this.#s=new g,this.#t=k("")}async loadEntries(){let t=await P(this.props.index);this.setState({entries:t});let e=U.get("jump");if(e){let s=e.toUpperCase().trim(),o=t[s];o&&p.gotoPage(o.url)}}async requestCode(t){console.log(t);let e=await this.#o.open(),s=this.#t.getValue().toUpperCase().trim(),o=await h.sha256(s);if(e!==0)return null;if(o.substring(0,4)!==t.chk)return await this.#s.open(),null;{let n=t.url;return n.substring(0,n.length-4)+s.toUpperCase().trim()+"/"}}#r=async t=>{let e=this.state.entries[t];if(e){let s=e.url;if(this.#e.value=e.text,this.#t.setValue(""),s.endsWith(".hash")){let o=await this.requestCode(e);o&&p.gotoPage(o)}else p.gotoPage(s+"/")}};componentDidMount(){}componentWillUnmount(){}render(){return a`
            <${l} entries=${this.state.entries} onSelect=${this.#r} />
            <${x} title="Access code required" buttons="Cancel,OK" model=${this.#o}>
                <p>The unit '${this.#e.value}' requires an access code.</p>
                <p>Please enter the code to continue.</p>
                <${v} store=${this.#t} />
            <//>
            <${x} title="Error" buttons="OK" model=${this.#s}>
                <p>
                    Sorry, that code was not correct.
                    Please check the code with your teacher
                    and give it another go.
                </p>
            <//>
        `}};S.mountApplet("searchbar",f);export{f as SearchBar};
