import{B as b,H as C,a as n,e as o,g as f,k as v,q as l,s as U,t as w,u as g,v as x,w as S,y as r}from"./chunks/OBVZ5JR7.js";import"./chunks/UBMAP5WQ.js";var D=new Set("abcdefghijklmnopqrstuvwxyz0123456789-"),u=class{constructor(t){this.uname=t.uname,this.mtime=t.mtime??0,this.title=t.title,this.category=t.category,this.thumb=t.thumb,this.audio=t.audio,this.video=t.video,this.baseUrl=this.createUrl()}createUrl(){let t=this.uname,e=[];for(let s of t.toLowerCase())D.has(s)&&e.push(s);return`${e.join("").substring(0,5)}/${t}`}getUrl(t){return f.resolve(`/videos/videpo2/${this.baseUrl}/${t}`)}getThumbUrl(){return this.getUrl(this.thumb)}getAudioUrl(){return this.audio&&this.audio.length>0?this.getUrl(this.audio[0]):null}getVideoUrl(){return this.video&&this.video.length>0?this.getUrl(this.video[0]):null}};var m=class extends n.Component{#t;constructor(t){super(t),this.#t={}}#e=t=>{this.#t.audio?.play(),this.#t.video?.play()};#i=t=>{this.#t.audio?.pause(),this.#t.video?.pause()};componentDidMount(){this.#t.audio&&this.#t.video&&(this.#t.audio.addEventListener("play",this.#e),this.#t.audio.addEventListener("pause",this.#i))}componentWillUnmount(){this.#t.audio&&this.#t.video&&(this.#t.audio.removeEventListener("play",this.#e),this.#t.audio.removeEventListener("pause",this.#i))}render(){let t=this.props.thumb,e=this.props.audio,i=this.props.video;if(e&&i)return o`
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
            `}};var c=class extends n.Component{#t;#e;constructor(t){super(t),this.#t=r.PrimitiveStore.of(0),this.#e=this.props.store,this.state={categories:[]}}#i=t=>{let e=t.newValue,i=e>0?this.state.categories[e]:null;this.#e.setValue(i)};async#s(){let t=await l("videpo.list_categories");t.sort(),this.setState({categories:["Select category",...t]}),this.#t.setValue(0)}componentDidMount(){this.#t.addListener(this.#i),this.#s()}componentWillUnmount(){this.#t.removeListener(this.#i)}render(){return o`
            <${b} store=${this.#t} options=${this.state.categories} />
        `}};var h=class extends n.Component{#t;#e;constructor(t){super(t),this.#e=t.categoryStore,this.state={units:[]}}static getDerivedStateFromProps(t,e){let i=Object.values(t.units);return i.sort((s,a)=>s.title.localeCompare(a.title)),{units:i}}render(){let t=this.state.units.map(e=>o`<li key=${e.uname}>${e.title}</li>`);return o`
            <${S} name="modify-units" title="Modify units" buttons="Delete,Move,Cancel">
                <${c} store=${this.#e} />
                <div class="scrollpane">
                    <ul>${t}</ul>
                </div>
            <//>
        `}};var P=new URLSearchParams(window.location.search),p=class extends n.Component{#t;#e;#i;#s;#o;constructor(t){super(t),this.#t=r.PrimitiveStore.of(""),this.#e=r.PrimitiveStore.of(null),this.#i=r.PrimitiveStore.of(null),this.#s=r.PrimitiveStore.of(""),this.#o=new w,this.state={units:{},selectedUnits:{},activeUnit:null}}async#l(t){let e=await l("videpo.query",t);e&&this.setState({activeUnit:new u(e)})}async#n(){let t=this.#s.getValue().toLowerCase(),e=this.#e.getValue(),i={};t&&(i.text=t),e&&(i.category=e),console.info(`Search: ${JSON.stringify(i)}`);let s=await l("videpo.search",i),a={};for(let L of s){let $=new u(L);a[$.uname]=$}this.setState({units:a,selectedUnits:{},activeUnit:null})}#c=async t=>{let e=P.get("p");e?this.#l(e):this.#n()};#u=t=>{this.#s.setValue(""),this.#e.setValue(0),this.#n()};#r=t=>{this.#n()};#a=t=>{};#d=t=>{let e=Object.assign({},this.state.selectedUnits),i=t.target.value,s=this.state.units[i];s===void 0||e[i]?delete e[i]:e[i]=s,this.setState({selectedUnits:e})};#m=async t=>{let e=Object.keys(this.state.selectedUnits),i=await this.#o.open("modify-units");if(i===1){let s=this.#i.getValue(),a=await l("videpo.move",s,e);console.info(`Move result: ${a}`)}else i===2&&(console.info("Delete units:"),console.info(e))};componentDidMount(){this.#c(),v.pasteListenerList.add(this.#a),this.#e.addListener(this.#r)}componentWillUnmount(){this.#e.removeListener(this.#r),v.pasteListenerList.remove(this.#a)}#h(){let t=this.state.activeUnit,e=t.getThumbUrl(),i=t.getVideoUrl(),s=t.getAudioUrl();return o`
            <${m} thumb=${e} video=${i} audio=${s} />
        `}#p(){let t=Object.values(this.state.units);t.sort((i,s)=>i.title.localeCompare(s.title));let e=t.map(i=>{let s=this.state.selectedUnits[i.uname]!==void 0;return o`
                <article key=${i.uname}>
                    <div class="thumbnail">
                        <img src=${i.getThumbUrl()} />
                    </div>
                    <footer>
                        <input type="checkbox" value=${i.uname} onChange=${this.#d} checked=${s} />
                        <a href="?p=${i.uname}">
                            ${i.title}
                        </a>
                    </footer>
                </article>
            `});return o`
            <div class="media-grid">${e}</div>
            <div class="pico">
                <${g} name="Modify units" onClick=${this.#m} />
            </div>
        `}render(){U.loadCss({path:"js/applets/videpo/videpo.css",content:`.videpo {
    margin-top: 1rem;

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

        & img {
            max-height: 5rem;
        }
    }

    & footer {
        display: flex;
        flex-flow: row nowrap;
        align-items: start;
        justify-content: start;
    }

    & a {
        text-decoration: none;
        text-align: left;
    }

    & article.preview {
        filter: grayscale(100%);
    }

    & footer {
        text-align: center;
        font-size: small;
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
`});let t=null;return this.state.activeUnit?t=this.#h():t=this.#p(),o`
            <div class="videpo">
                <nav class="pico header">
                    <fieldset role="group">
                    <${C} store=${this.#s} onSubmit=${this.#r} />
                    <${c} store=${this.#e} />
                    <${g} icon="x-circle" onClick=${this.#u} />
                    </fieldset>
                </nav>
                ${t}
                <${x} model=${this.#o}>
                    <${h} categoryStore=${this.#i} units=${this.state.selectedUnits} />
                <//>
            </div>
        `}};var pt=p;export{pt as default};
