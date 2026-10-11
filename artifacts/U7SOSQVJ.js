import{C,F as L,a as n,e as o,g as v,k as g,r,t as x,u as U,v as m,w as S,x as b,z as a}from"./chunks/CG5B4ACS.js";import"./chunks/UBMAP5WQ.js";var D=new Set("abcdefghijklmnopqrstuvwxyz0123456789-"),u=class{constructor(t){this.uname=t.uname,this.mtime=t.mtime??0,this.title=t.title,this.category=t.category,this.thumb=t.thumb,this.audio=t.audio,this.video=t.video,this.baseUrl=this.createUrl()}createUrl(){let t=this.uname,e=[];for(let s of t.toLowerCase())D.has(s)&&e.push(s);return`${e.join("").substring(0,5)}/${t}`}getUrl(t){return v.resolve(`/videos/videpo/${this.baseUrl}/${t}`)}getThumbUrl(){return this.getUrl(this.thumb)}getAudioUrl(){return this.audio&&this.audio.length>0?this.getUrl(this.audio[0]):null}getVideoUrl(){return this.video&&this.video.length>0?this.getUrl(this.video[0]):null}};var h=class extends n.Component{#t;constructor(t){super(t),this.#t={}}#e=t=>{this.#t.audio?.play(),this.#t.video?.play()};#i=t=>{this.#t.audio?.pause(),this.#t.video?.pause()};componentDidMount(){this.#t.audio&&this.#t.video&&(this.#t.audio.addEventListener("play",this.#e),this.#t.audio.addEventListener("pause",this.#i))}componentWillUnmount(){this.#t.audio&&this.#t.video&&(this.#t.audio.removeEventListener("play",this.#e),this.#t.audio.removeEventListener("pause",this.#i))}render(){let t=this.props.thumb,e=this.props.audio,i=this.props.video;if(e&&i)return o`
                <div class="media-player">
                    <video ref=${s=>this.#t.video=s} loop muted>
                        <source src=${i} />
                    </video>
                    <audio ref=${s=>this.#t.audio=s} loop controls>
                        <source src=${e} />
                    </audio>
                </div>
            `;if(e&&t)return o`
                <div class="media-player">
                    <img src=${t} />
                    <audio ref=${s=>this.#t.audio=s} controls>
                        <source src=${e} />
                    </audio>
                </div>
            `;if(i&&t)return o`
                <div class="media-player">
                    <video ref=${s=>this.#t.video=s} controls>
                        <source src=${i} />
                    </video>
                </div>
            `;if(t)return o`
                <div class="media-player">
                    <img src=${t} />
                </div>
            `}};var l=class extends n.Component{#t;#e;constructor(t){super(t),this.#t=a.PrimitiveStore.of(0),this.#e=this.props.store,this.state={categories:[]}}#i=t=>{let e=t.newValue,i=e>0?this.state.categories[e]:null;this.#e.setValue(i)};async#s(){let t=await r("videpo.list_categories");t.sort(),this.setState({categories:["Select category",...t]}),this.#t.setValue(0)}componentDidMount(){this.#t.addListener(this.#i),this.#s()}componentWillUnmount(){this.#t.removeListener(this.#i)}render(){return o`
            <${C} store=${this.#t} options=${this.state.categories} />
        `}};var p=class extends n.Component{#t;#e;constructor(t){super(t),this.#e=t.categoryStore,this.state={units:[]}}static getDerivedStateFromProps(t,e){let i=Object.values(t.units);return i.sort((s,c)=>s.title.localeCompare(c.title)),{units:i}}render(){let t=this.state.units.map(e=>o`<li key=${e.uname}>${e.title}</li>`);return o`
            <${b} name="modify-units" title="Modify units" buttons="Delete,Move,Cancel">
                <${l} store=${this.#e} />
                <div class="scrollpane">
                    <ul>${t}</ul>
                </div>
            <//>
        `}};var M=new URLSearchParams(window.location.search),f=class extends n.Component{#t;#e;#i;#s;#n;constructor(t){super(t),this.#t=a.PrimitiveStore.of(""),this.#e=a.PrimitiveStore.of(null),this.#i=a.PrimitiveStore.of(null),this.#s=a.PrimitiveStore.of(""),this.#n=new U,this.state={units:{},selectedUnits:{},activeUnit:null}}async#l(t){let e=await r("videpo.query",t);e&&this.setState({activeUnit:new u(e)})}async#o(t=""){let e=this.#s.getValue().toLowerCase(),i=this.#e.getValue();console.info(`Search text='${e}' category='${i}' start=${t}`);let s={start:t};e&&(s.text=e),i&&(s.category=i),console.info(`Search: ${JSON.stringify(s)}`);let c=await r("videpo.search",s),$={};for(let k of c){let w=new u(k);$[w.uname]=w}this.setState({units:$,selectedUnits:{},activeUnit:null})}#c=async t=>{let e=M.get("p");e?this.#l(e):this.#o()};#u=t=>{this.#s.setValue(""),this.#e.setValue(0),this.#o()};#r=t=>{this.#o()};#d=t=>{let e="";for(let i of Object.values(this.state.units))i.uname>e&&(e=i.uname);this.#o(e+"$")};#a=t=>{};#m=t=>{let e=Object.assign({},this.state.selectedUnits),i=t.target.value,s=this.state.units[i];s===void 0||e[i]?delete e[i]:e[i]=s,this.setState({selectedUnits:e})};#h=async t=>{let e=Object.keys(this.state.selectedUnits),i=await this.#n.open("modify-units");if(i===1){let s=this.#i.getValue(),c=await r("videpo.move",s,e);console.info(`Move result: ${c}`)}else if(i===2){console.info("Delete units:");let s=await r("videpo.delete",e);console.info(e)}this.#o()};componentDidMount(){this.#c(),g.pasteListenerList.add(this.#a),this.#e.addListener(this.#r)}componentWillUnmount(){this.#e.removeListener(this.#r),g.pasteListenerList.remove(this.#a)}#p(){let t=this.state.activeUnit,e=t.getThumbUrl(),i=t.getVideoUrl(),s=t.getAudioUrl();return o`
            <${h} thumb=${e} video=${i} audio=${s} />
        `}#f(){let t=Object.values(this.state.units);t.sort((i,s)=>i.title.localeCompare(s.title));let e=t.map(i=>{let s=this.state.selectedUnits[i.uname]!==void 0;return o`
                <article key=${i.uname}>
                    <div class="thumbnail">
                        <img src=${i.getThumbUrl()} />
                    </div>
                    <footer>
                        <input type="checkbox" value=${i.uname} onChange=${this.#m} checked=${s} />
                        <a href="?p=${i.uname}">
                            ${i.title}
                        </a>
                    </footer>
                </article>
            `});return o`
            <div class="media-grid">${e}</div>
            <div class="pico bottom-bar">
                <${m} name="Modify units" className="outline secondary" onClick=${this.#h} />
                <div class="result-count">${t.length} results.</div>
                <${m} name="Search more" className="outline secondary" onClick=${this.#d} />
            </div>
        `}render(){x.loadCss({path:"js/applets/videpo/videpo.css",content:`.videpo {
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
        text-align: center;
        font-size: small;
    }

    & a {
        text-decoration: none;
        text-align: left;
    }

    & article.preview {
        filter: grayscale(100%);
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
`});let t=null;return this.state.activeUnit?t=this.#p():t=this.#f(),o`
            <div class="videpo">
                <nav class="pico header">
                    <fieldset role="group">
                        <${L} store=${this.#s} onSubmit=${this.#r} />
                        <${l} store=${this.#e} />
                        <${m} icon="x-circle" onClick=${this.#u} />
                    </fieldset>
                </nav>
                ${t}
                <${S} model=${this.#n}>
                    <${p} categoryStore=${this.#i} units=${this.state.selectedUnits} />
                <//>
            </div>
        `}};var ft=f;export{ft as default};
