import{C as b,a as u,b as n,h as p,i as S,k as y,o as c,p as C,r as U,t as h,v as l,w as L}from"./chunks/ZFPXU6SY.js";import"./chunks/F7WQ4MB3.js";function V(r){if(r=p.parse(r),r?.hostname?.endsWith("youtube.com")){let t=r.search,e=new URLSearchParams(t).get("v");if(typeof e=="string"&&e.length===11)return`yt-${e}`}return null}var m=class r{static extract_prefix(t){let i="u-";for(let e of t.substring(3).toLowerCase())"abcdefghijklmnopqrstuvwxyz0123456789".includes(e)&&(i+=e);return i.substring(0,4)}constructor(t){this.uname=t.uname,this.mtime=t.mtime??0,this.title=t.title,this.category=t.category,this.isComplete=t.is_complete,this.info=t}getUrl(t){if(!t)return null;let i=r.extract_prefix(this.uname);return p.getURL(`videos/${i}/${this.uname}/${t}`)}getThumbUrl(){return this.getUrl("thumb.jpg")}getAudioUrl(){return this.getUrl(this.info.audio)}getVideoUrl(){return this.getUrl(this.info.video)}};var f=class extends u.Component{#t;constructor(t){super(t),this.#t={}}#e=t=>{this.#t.audio?.play(),this.#t.video?.play()};#i=t=>{this.#t.audio?.pause(),this.#t.video?.pause()};componentDidMount(){this.#t.audio&&this.#t.video&&(this.#t.audio.addEventListener("play",this.#e),this.#t.audio.addEventListener("pause",this.#i))}componentWillUnmount(){this.#t.audio&&this.#t.video&&(this.#t.audio.removeEventListener("play",this.#e),this.#t.audio.removeEventListener("pause",this.#i))}render(){let t=this.props.unit,i=t.getThumbUrl(),e=t.getAudioUrl(),s=t.getVideoUrl();return e&&s?n`
                <div class="media-player">
                    <video ref=${o=>this.#t.video=o} loop muted>
                        <source src=${s} />
                    </video>
                    <audio ref=${o=>this.#t.audio=o} loop controls>
                        <source src=${e} />
                    </audio>
                </div>
            `:e?n`
                <div class="media-player">
                    <img src=${i} />
                    <audio ref=${o=>this.#t.audio=o} controls>
                        <source src=${e} />
                    </audio>
                </div>
            `:s?n`
                <div class="media-player">
                    <video ref=${o=>this.#t.video=o} controls>
                        <source src=${s} />
                    </video>
                </div>
            `:n`
                <div class="media-player">
                    <img src=${i} />
                </div>
            `}};var d=class extends u.Component{#t;#e;constructor(t){super(t),this.#t=l.primitive(),this.#e=this.props.store??l.atom(),this.state={categoryNames:[]}}#i=t=>{this.#e.setValue(this.state.categoryNames[t])};async#s(){let t=await c("videpo.list_categories"),i=[];for(let e of t)i.push(e.name);i.sort(),this.setState({categoryNames:i}),this.#t.setValue(0)}componentDidMount(){this.#t.addListener(this.#i),this.#s()}componentWillUnmount(){this.#t.removeListener(this.#i)}render(){return n`
            <${L} store=${this.#t} options=${this.state.categoryNames} />
        `}};var M=new URLSearchParams(window.location.search),g=class extends u.Component{#t;#e;#i;#s;#a;#r;#o;constructor(t){super(t),this.#t=l.primitive(""),this.#e=l.primitive(""),this.#i=l.primitive(""),this.#s=l.primitive(),this.#a=new h.DialogModel,this.#r=new h.DialogModel,this.#o=null,this.state={units:{},selectedUnits:{},activeUnit:null}}async#n(){let t=this.#i.getValue().toLowerCase(),i=this.#s.getValue(),e={},s=await c("videpo.search_units",{text:t,category:i});for(let o of s){let a=new m(o);e[a.uname]=a}this.setState({units:e,selectedUnits:{},activeUnit:null})}async#l(){let t=M.get("uname");if(t){let i=await c("videpo.get_unit",t),e=new m(i);this.setState({units:{},activeUnit:e})}else this.#n()}async#c(t=""){if(this.#t.setValue(t),await this.#a.open()===0){let e=this.#e.getValue(),s=this.#t.getValue(),o=V(s);if(e&&o){console.info(`Add unit: category=${e} uname=${o}`);let a=await c("videpo.add_unit",o,e);console.info(a)}return!0}}#u=async t=>{let i=await this.#r.open(),e=Object.keys(this.state.selectedUnits);if(e.length!==0)if(i===0){let s=this.#e.getValue();if(!s)return!1;let o={};for(let a of e)o[a]={category:s};await c("videpo.update_units",o)}else i===1&&await c("videpo.delete_units",e)};#d=t=>{this.#c(t.length<256?t:"")};#h=t=>{this.#n()};#g=t=>{this.#i.setValue(""),this.#n(t)};#v=t=>{this.#i.setValue(""),this.#s.setValue(""),this.#n()};#m=t=>{let i=Object.assign({},this.state.selectedUnits),e=t.target.value,s=this.state.units[e];s===void 0||i[e]?delete i[e]:i[e]=s,this.setState({selectedUnits:i})};componentDidMount(){this.#l(),this.#o=y.pasteListenerList.add(this.#d)}componentWillUnmount(){y.pasteListenerList.remove(this.#o),this.#o=null}render(){C.loadCss("videpo.css");let t=this.state.activeUnit,i=t?this.#f(t):this.#p(),e=$=>this.setState({addUnitDialogOpen:!1}),s=$=>this.#c(),o=this.state.selectedUnits,a=Object.keys(o);a.sort();let v=a.map(function($){let w=o[$];return n`<li key=${w.uname}>${w.title}</li>`});return n`
            <nav class="header">
                <${U} icon="plus-circle" onClick=${s} />
                <${b} store=${this.#i} onSubmit=${this.#h} />
                <${d} store=${this.#s} />
                <${U} icon="disk" onClick=${this.#u} />
            </nav>
            ${i}

            <${h.DialogWindow} title="Add unit" buttons="Cancel,OK" model=${this.#a}>
                <label>
                    <span>Category</span><${d} store=${this.#e} />
                </label>
                <label>
                    <span>URL</span><${b} store=${this.#t} />
                </label>
            <//>
            <${h.DialogWindow} title="Modify units" model=${this.#r}>
                <ul>
                    ${v}
                </ul>
                <label>
                    <span>Category</span><${d} store=${this.#e} />
                </label>
            <//>
        `}#p(){let t=this.state.selectedUnits,i=Object.values(this.state.units);i.sort(function(s,o){return s.mtime-o.mtime});let e=i.map(s=>{let o=s.getThumbUrl(),a=s.isComplete?"complete":"preview",v=t[s.uname]!==void 0;return n`
                <article key=${s.uname} class=${a}>
                    <div class="thumbnail">
                        <img src=${o} />
                        <input type="checkbox" value=${s.uname} onChange=${this.#m} checked=${v} />
                    </div>
                    <footer>
                        <a href="?uname=${s.uname}">
                            ${s.title}
                        </a>
                    </footer>
                </article>
            `});return n`
            <div class="media-grid">
                ${e}
            </div>
        `}#f(t){return n`
            <${f} unit=${t} />
        `}};S.mountApplet("videpo",g);
