import{C as U,K as l,b as $,c as r,g as s,i as C,k as L,l as m,m as k,n as d,p as a,s as w,t as D,w as p}from"./chunks/2F6KTMXK.js";import"./chunks/UBMAP5WQ.js";var M=new Set("abcdefghijklmnopqrstuvwxyz0123456789-"),h=class{constructor(t){this.uname=t.uname,this.mtime=t.mtime??0,this.title=t.title,this.category=t.category,this.thumb=t.thumb,this.audio=t.audio,this.video=t.video,this.baseUrl=this.createUrl()}createUrl(){let t=this.uname,e=[];for(let o of t.toLowerCase())M.has(o)&&e.push(o);return`${e.join("").substring(0,5)}/${t}`}getUrl(t){return $.resolve(`/videos/videpo/${this.baseUrl}/${t}`)}getThumbUrl(){return this.getUrl(this.thumb)}getAudioUrl(){return this.audio&&this.audio.length>0?this.getUrl(this.audio[0]):null}getVideoUrl(){return this.video&&this.video.length>0?this.getUrl(this.video[0]):null}};var f=class extends r.Component{#t;constructor(t){super(t),this.#t={}}#e=t=>{this.#t.audio?.play(),this.#t.video?.play()};#i=t=>{this.#t.audio?.pause(),this.#t.video?.pause()};componentDidMount(){this.#t.audio&&this.#t.video&&(this.#t.audio.addEventListener("play",this.#e),this.#t.audio.addEventListener("pause",this.#i))}componentWillUnmount(){this.#t.audio&&this.#t.video&&(this.#t.audio.removeEventListener("play",this.#e),this.#t.audio.removeEventListener("pause",this.#i))}render(){let t=this.props.thumb,e=this.props.audio,i=this.props.video;if(e&&i)return s`
                <div class="media-player">
                    <video ref=${o=>this.#t.video=o} loop muted>
                        <source src=${i} />
                    </video>
                    <audio ref=${o=>this.#t.audio=o} loop controls>
                        <source src=${e} />
                    </audio>
                </div>
            `;if(e&&t)return s`
                <div class="media-player">
                    <img src=${t} />
                    <audio ref=${o=>this.#t.audio=o} controls>
                        <source src=${e} />
                    </audio>
                </div>
            `;if(i&&t)return s`
                <div class="media-player">
                    <video ref=${o=>this.#t.video=o} controls>
                        <source src=${i} />
                    </video>
                </div>
            `;if(t)return s`
                <div class="media-player">
                    <img src=${t} />
                </div>
            `}};var c=class extends r.Component{#t;constructor(t){super(t),this.#t=t.allowAny??!1,this.state={categories:[]}}async#e(){let t=this.props.store,e=await l("videpo.list_categories");e.sort();let i=[];this.#t&&i.push(new w("Any",null));for(let o of e)i.push(new w(o,o));this.setState({categories:i}),t.setValue(i[0])}componentDidMount(){this.#e()}componentWillUnmount(){}render(){return s`
            <${D} store=${this.props.store} options=${this.state.categories} />
        `}};var v=class extends r.Component{#t;#e;constructor(t){super(t),this.#t=a.PrimitiveStore.of(this.props.url),this.#e=a.PrimitiveStore.of(this.props.categoryStore)}render(){return s`
            <${d} name="add-unit" title="Add unit" buttons="Cancel,OK">
                <${c} store=${this.#e} />
                <label>
                    <span>URL</span>
                    <${p} store=${this.#t} />
                </label>
            <//>
        `}};var g=class extends r.Component{#t;#e;constructor(t){super(t),this.#e=t.categoryStore,this.state={units:[]}}static getDerivedStateFromProps(t,e){let i=Object.values(t.units);return i.sort((o,n)=>o.title.localeCompare(n.title)),{units:i}}render(){let t=this.state.units.map(e=>s`<li key=${e.uname}>${e.title}</li>`);return s`
            <${d} name="modify-units" title="Modify units" buttons="Delete,Move,Cancel">
                <${c} store=${this.#e} />
                <div class="scrollpane">
                    <ul>${t}</ul>
                </div>
            <//>
        `}};var P=new URLSearchParams(window.location.search),y=class extends r.Component{#t;#e;#i;#o;#s;constructor(t){super(t),this.#t=a.PrimitiveStore.of(""),this.#e=a.PrimitiveStore.of(null),this.#i=a.PrimitiveStore.of(null),this.#o=a.PrimitiveStore.of(""),this.#s=new L,this.state={units:{},selectedUnits:{},activeUnit:null}}async#d(t){let e=await l("videpo.query",t);e&&this.setState({activeUnit:new h(e)})}async#n(t=""){let e=this.#o.getValue().toLowerCase(),i=this.#e.getValue();console.info(`Search text='${e}' category='${i}' start=${t}`);let o={start:t};e&&(o.text=e),i&&i.value&&(o.category=i.value),console.info(`Search: ${JSON.stringify(o)}`);let n=await l("videpo.search",o),x={};for(let A of n){let S=new h(A);x[S.uname]=S}this.setState({units:x,selectedUnits:{},activeUnit:null})}#u=async t=>{let e=P.get("p");e?this.#d(e):this.#n()};async#a(t,e){console.info(`Add ${t} to category ${e.category}`);let i=await l("videpo.schedule",t,e);i?console.info(`Added unit: ${i}`):await this.#s.open("add-error")}#m=t=>{this.#o.setValue(""),this.#e.setValue(0),this.#n()};#r=t=>{this.#n()};#l=t=>{t.oldValue&&this.#n()};#h=t=>{let e="";for(let i of Object.values(this.state.units))i.uname>e&&(e=i.uname);this.#n(e+"$")};#p=async t=>{let e=await this.#s.open("add-unit"),i=this.#t.getValue(),o=this.#i.getValue()?.value;o?e===0&&this.#a(i,{category:o}):console.warn("Couldn't perform action because category selector was not initialised."),console.info(e)};#c=t=>{let e=t.text;this.#t.setValue(t.text),this.#p(e.length<256?e:"")};#f=t=>{let e=Object.assign({},this.state.selectedUnits),i=t.target.value,o=this.state.units[i];o===void 0||e[i]?delete e[i]:e[i]=o,this.setState({selectedUnits:e})};#v=async t=>{let e=Object.keys(this.state.selectedUnits),i=await this.#s.open("modify-units"),o=this.#i.getValue()?.value;if(!o)console.warn("Couldn't perform action because category selector was not initialised.");else if(i===1){let n=await l("videpo.move",o,e);console.info(`Move result: ${n}`)}else if(i===2){console.info("Delete units:");let n=await l("videpo.delete",e);console.info(e)}this.#n()};#g=async t=>{let e=this.state.activeUnit;await this.#s.open("redownload")===1&&this.#a(e.uname,{category:e.category,restart:!0})};componentDidMount(){this.#u(),U.pasteListenerList.add(this.#c),this.#e.addListener(this.#l),this.#o.addListener(this.#r)}componentWillUnmount(){this.#o.removeListener(this.#r),this.#e.removeListener(this.#l),U.pasteListenerList.remove(this.#c)}#y(){let t=this.state.activeUnit,e=t.getThumbUrl(),i=t.getVideoUrl(),o=t.getAudioUrl();return s`
            <${f} thumb=${e} video=${i} audio=${o} />
            <div class="pico">
                <${m} name="Redownload" className="outline secondary" onClick=${this.#g} />
            </div>
        `}#$(){let t=Object.values(this.state.units);t.sort((i,o)=>i.title.localeCompare(o.title));let e=t.map(i=>{let o=this.state.selectedUnits[i.uname]!==void 0,n=i.title.trim();return n===""&&(n=i.uname),s`
                <article key=${i.uname}>
                    <a href="?p=${i.uname}">
                        <div class="thumbnail">
                            <img src=${i.getThumbUrl()} />
                        </div>
                        <footer>
                            <input type="checkbox" value=${i.uname} onChange=${this.#f} checked=${o} />
                            <div class="title">${n}</div>
                        </footer>
                    </a>
                </article>
            `});return s`
            <div class="media-grid">${e}</div>
            <div class="pico bottom-bar">
                <${m} name="Modify units" className="outline secondary" onClick=${this.#v} />
                <div class="result-count">${t.length} results.</div>
                <${m} name="Search more" className="outline secondary" onClick=${this.#h} />
            </div>
        `}render(){C.loadCss({path:"js/applets/videpo/videpo.css",content:`.videpo {
    margin: 1rem 0 3rem 0;

    nav {
        display: flex;
        flex-flow: row nowrap;
    }

    & .media-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-column-gap: 0.125rem;
        grid-row-gap: 0.125rem;
    }

    & div.thumbnail {
        position: relative;
        text-align: center;

        & img {
            max-height: 5rem;
        }
    }

    & footer {
        display: flex;
        flex-flow: row nowrap;
        align-items: start;
        justify-content: start;
        gap: 0.5rem;
        font-size: small;
    }

    & a {
        display: block;
        text-decoration: none;
    }

    & .title {
        text-align: left;
        text-wrap: balance;
    }

    & div.bottom-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: var(--pico-background-color);
        padding: 1rem;

        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        transition: opacity ease-in-out 0.5s;
        gap: 1rem;

        & .result-count {
            font-size: small;
            text-align: center;
            width: 20rem;
        }
    }

    & .media-player {
        max-width: 100%;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;

        & img {
            width: 100%;
        }

        & video {
            width: 100%;
        }

        & audio {
            width: 100%;
        }
    }

    div.scrollpane {
        flex-grow: 1;
        flex-shrink: 1;
        overflow-y: scroll;
    }
}
`});let t=null;return this.state.activeUnit?t=this.#y():t=this.#$(),s`
            <div class="videpo">
                <nav class="pico header">
                    <fieldset role="group">
                        <${p} store=${this.#o} onSubmit=${this.#r} />
                        <${c} store=${this.#e} allowAny=${!0} />
                        <${m} icon="x-circle" onClick=${this.#m} />
                    </fieldset>
                </nav>
                ${t}
                <${k} model=${this.#s}>
                    <${v} categoryStore=${this.#i} url=${this.#t} />
                    <${g} categoryStore=${this.#i} units=${this.state.selectedUnits} />

                    <${d} name="redownload" title="Are you sure?" buttons="OK,Cancel">
                        If you choose to redownload, the old unit media will be deleted.
                    <//>

                    <${d} name="add-error" title="Error adding unit" buttons="OK">
                        An error occurred when adding the URL.
                    <//>
                <//>
            </div>
        `}};var kt=y;export{kt as default};
