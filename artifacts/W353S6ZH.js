import{I as u,a as l,e as n,f as p,r as h,x as f,y as m}from"./chunks/OBVZ5JR7.js";import"./chunks/UBMAP5WQ.js";var g=/([a-z])[=](.*)/,r=class extends l.Component{#t;#e;#n;#s;constructor(e){super(e);let t=f.files.load(e.files[0]).toUpperCase();this.#t=this.#o(t),this.#e=e.store??m.PrimitiveStore.of(t),this.state={restoredLines:[]},this.#n=0;for(let s of this.#t)this.originalSize+=s.length+1}componentDidMount(){this.#e.addAndFireListener(this.#i)}componentWillUnmount(){this.#e.removeListener(this.#i)}#o(e){let t=[];for(let s of p.splitLines(e))t.push(s.trim());return t}#r(e,t){let s=o=>t[o]??"";for(let o=0;o<20;o+=1){let i=e.replace(/[a-z]/g,s);if(i===e)break;e=i}return e.replace(/[_.\-]/g," ").trim()}#i=e=>{let t={},s=0,o=this.#o(e.newValue),i=[];for(let c of o){let a=c.match(g);if(s+=c.length+1,a){let d=a[1],v=a[2];t[d]=v.trim()}else{let d=this.#r(c,t);i.push(d)}}this.#s=s,this.setState({restoredLines:i})};render(){h({path:"js/applets/compress-fu/compress-fu.css",content:`.compress-fu {
    div.diff-view {
        position: relative;
        overflow: auto;
        width: 100%;
        height: 20rem;

        & .diff-layer {
            white-space: pre;
            position: absolute;
            inset: 0;
        }

        & .original {
            color: #00ffff;
            opacity: 0.5;
        }

        & .restored {
            color: #ff0000;
        }
    }

    & div.report {
        text-align: right;
        color: green;
    }

    & div.report.error {
        color: red;
    }

    .uppercase textarea {
//        text-transform: uppercase;
    }
}
`});let e=this.#t.join(`
`).trim(),t=this.state.restoredLines.join(`
`).trim(),s=Math.round(this.#s*100/e.length),o=t===e?n`
            <div class="report">
                Compressed size: ${this.#s} bytes
                (${s}%)
            </div>
        `:n`
            <div class="report error">
                The restored text does not match the original!
            </div>
        `;return n`
            <div class="compress-fu pico">
                <section>
                    <h2>The uncompressed text</h2>
                    <div class="diff-view">
                        <div class="diff-layer restored">${t}</div>
                        <div class="diff-layer original">${e}</div>
                    </div>
                    ${o}
                </section>
                <section>
                    <h2>The compressed text</h2>
                    <div class="uppercase">
                        <${u} store=${this.#e} cols=${40} rows=${10}/>
                    </div>
                </section>
            </div>
        `}};var j=r;export{j as default};
