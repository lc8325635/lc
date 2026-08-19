import{A as h,a as t,b as s,p as o,v as r,x as i}from"./ZFPXU6SY.js";var a=class extends t.Component{#e;#t;#s;constructor(e){super(e),this.#e=r.primitive(),this.#t=e.filepaths,this.#s=e.prelude}render(){let{gfx:e,...l}=this.props;return o.loadCss("minide.css"),s`
            <div class="minide">
                <${i} filepaths=${this.#t} filepathStore=${this.#e} />
                <${h} filepathStore=${this.#e} prelude=${this.#s} gfx=${e} />
            </div>
        `}};export{a};
