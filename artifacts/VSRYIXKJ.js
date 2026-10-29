import{I as u,c as m,g as r,i as $,j as x,k as S,l,m as y,n as M,o as f,p as A,q as B,r as D,t as I}from"./chunks/2F6KTMXK.js";import"./chunks/UBMAP5WQ.js";var h=class g{constructor(e,t){this.width=e,this.height=t,this.data=new Uint8Array(this.width*t),this.listenerList=new x}clone(){let e=new g(this.width,this.height);for(let t=0;t<this.data.length;t+=1)e.data[t]=this.data[t];return e}clear(){this.data.fill(0),this.listenerList.fire({})}getAddr(e,t){return e>=0&&e<this.width&&t>=0&&t<this.height?t*this.width+e:null}setPixel(e,t,i){let s=this.getAddr(e,t);return s===null||this.data[s]===i?!1:(this.data[s]=i,this.listenerList.fire({}),!0)}getPixel(e,t){let i=this.getAddr(e,t);return this.data[i]}merge(e){let t=1/e.length;for(let i=0;i<this.height;i+=1)for(let s=0;s<this.width;s+=1){let a=i*this.width+s,n=0;for(let o of e)n+=o.getPixel(s,i)*t;this.data[a]=Math.round(n)}this.listenerList.fire({})}compare(e){if(e.width!==this.width||e.height!==this.height)return 1;let t=0;for(let s=0;s<this.data.length;s+=1){let a=e.data[s],n=this.data[s],o=a-n;t+=o*o}let i=65025*this.data.length;return t/i}fromHex(e){let t=u.fromHex(e);for(let i=0;i<this.data.length;i+=1)this.data[i]=t.getBit(i)?255:0}toHex(){let e=new u;for(let t=0;t<this.data.length;t+=1)this.data[t]&&e.setBit(t,!0);return e.toHex()}};var c=class extends m.Component{#t;#e;constructor(e){super(e),this.state={penColour:255,isEditable:e.isEditable??!1};let t=e.cellSize??5;this.#e=e.byteMap,this.#t=new D({preferredSize:{x:this.#e.width*t,y:this.#e.height*t}})}componentDidMount(){this.state.isEditable&&(this.#t.listenerMap.add("pointer-move",this.#l),this.#t.listenerMap.add("pointer-down",this.#n)),this.#t.listenerMap.add("repaint",this.#a),this.#e.listenerList.add(this.#a),this.#s()}componentWillUnmount(){this.#t.listenerMap.remove("repaint",this.#a),this.state.isEditable&&(this.#t.listenerMap.remove("pointer-down",this.#n),this.#t.listenerMap.remove("pointer-move",this.#l)),this.#e.listenerList.remove(this.#a)}#a=e=>{this.#s()};#i(e,t){let i=this.#e;return Math.floor(Math.min(e/i.width,t/i.height))}#s(){let e=this.#e,t=this.#t.canvas,i=t.getContext("2d"),s=this.#i(t.width,t.height);i.fillStyle="#080",i.fillRect(0,0,t.width,t.height);for(let a=0;a<e.height;a+=1)for(let n=0;n<e.width;n+=1){let o=e.getPixel(n,a).toString(16).padStart(2,"0");i.fillStyle=`#${o}${o}${o}`,i.fillRect(n*s+1,a*s+1,s-2,s-2)}}#l=e=>{let t=this.#t.canvas,i=t.getContext("2d"),s=this.#i(t.width,t.height),a=Math.floor(e.x/s),n=Math.floor(e.y/s);e.isPressed&&this.#e.setPixel(a,n,this.state.penColour)&&this.#s()};#n=e=>{let t=this.#t.canvas,i=t.getContext("2d"),s=this.#i(t.width,t.height),a=Math.floor(e.x/s),n=Math.floor(e.y/s);this.#e.setPixel(a,n,this.state.penColour)&&this.#s()};#r=e=>{this.#e.clear()};#o=e=>{this.setState({penColour:255})};#h=e=>{this.setState({penColour:0})};render(){let e=this.state.isEditable?r`
            <div class="toolbar">
                <${l} icon="x-circle" name="Clear" onClick=${this.#r} />
                <${l} icon="paint" name="Paint" disabled=${!!this.state.penColour} onClick=${this.#o} />
                <${l} icon="erase" name="Erase" disabled=${!this.state.penColour} onClick=${this.#h} />
            </div>
        `:null;return r`
            ${e}
            <${B} controller=${this.#t} />
        `}};var d=class g{static fromString(e,t,i){let s=i.charAt(0),a=new h(e,t);return a.fromHex(i.substring(1)),new g(s,a)}constructor(e,t){this.label=e,this.image=t}toString(){return this.label+this.image.toHex()}};var b=["A081C34267EC3C180","A18183C247E42C380","A0C0C1C14363E6341","A00003C34347C58","A003E223C36223E","A18284C44FE828301","A1C3622427EC28181","A00003C2464647C","A001E1222627EC0","A1C346442FE828282","A1C36223C2446667C","A00183C247C4242C3","B7E66347CC4C47C0C","B0E3A321E1A22223E","B6E42723F6242623E","B1E3414FC8484641C","B020202023E24243E","B0202023E2622321E","B0604043C644C6838","B1E32223E3622321E","B7E623E7EC2C2721E","B0202023E2224341C","B3E321E7E42427A0E","B0604043C2444643C","C3E22438103C24E38","C007E4202022638","C7E424282060478","C007C020202065C70","C1F3101010141423E","C003C640602361C","C0C7642030143663C","C3CC6830103C67C30","C003C06020303423C","C000C3602023E","C3C66420202020EF8","C00784E02066C38"];var v=8,E=8,p=class extends m.Component{#t;#e;#a;#i=["A","B","C"];#s=[];constructor(e){super(e),this.#t=new h(v,E),this.#e=A.PrimitiveStore.of(this.#i[0]),this.#a=new S,this.state={labelledImages:[],recognisedAs:"",highlightMatch:!1,score:0};for(let t=0;t<this.#i.length;t+=1)this.#s.push(new h(v,E));this.#l()}componentDidMount(){}componentWillUnmount(){}#l(){try{let t=f.getStorage().getItem("training-data"),i=[];for(let s of t){let a=d.fromString(8,8,s);i.push(a)}this.#o(i)}catch(e){console.warn(e)}}#n(e){let t=f.getStorage(),i=[];for(let s of e)i.push(s.toString());t.setItem("training-data",i)}#r(e){let t=2,i=null;for(let s=0;s<this.#i.length;s+=1){let n=this.#s[s].compare(e);n<t&&(t=n,i=s)}return this.#i[i]}#o(e){this.setState({labelledImages:e,recognisedAs:""}),this.#t.clear();let t={};for(let i of this.#i)t[i]=[];for(let i of e)t[i.label].push(i.image);for(let i=0;i<this.#s.length;i+=1){let s=this.#i[i];this.#s[i].merge(t[s])}}#h=e=>{let t=this.#e.getValue(),i=this.#t.clone(),s=new d(t,i),a=[...this.state.labelledImages,s];this.#o(a),this.#n(a)};#c=e=>{let t=this.#r(this.#t);this.setState({recognisedAs:t,highlightMatch:!0}),window.setTimeout(i=>{this.setState({highlightMatch:!1})},600)};#d=async e=>{let t=0;for(let s of b){let a=d.fromString(v,E,s);this.#r(a.image)===a.label&&(t+=1)}let i=Math.round(100*t/b.length);this.setState({score:i}),await this.#a.open("test-results")};render(){$.loadCss({path:"js/applets/pixel-matching-learner/pixel-matching-learner.css",content:`div.pixel-matching-learner {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    .toolbar {
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        justify-content: start;
        gap: 1rem;

        & button {
            margin: 0;
            height: 3rem;
        }
    }

    div.carousel, div.heatmaps {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        overflow-x: auto;
        width: 30rem;
    }

    div.labelled-image, div.heatmap {
        display: flex;
        flex-flow: column wrap;
        justify-content: start;
        align-items: center;

        input {
            display: block;
        }
    }
}
`});let e=[],t=this.state.labelledImages;for(let a=0;a<t.length;a+=1){let n=t[a],o=P=>{let w=t.filter(k=>k!==n);this.#o(w),this.#n(w)},C=r`
                <div class="labelled-image" key=${n.toString()}>
                    <input class="widget" type="button" value="❌" onClick=${o} />
                    <${c} key=${a} byteMap=${n.image} />
                    <div>${n.label}</div>
                </div>
            `;e.push(C)}let i=[];for(let a=0;a<this.#i.length;a+=1){let n=this.#i[a],o=this.#s[a],C=r`
                <div class="heatmap">
                    <div>
                        ${n}
                    </div>
                    <${c} key=${a} byteMap=${o} cellSize=${10} />
                </div>
            `;i.push(C)}let s=this.state.highlightMatch?"highlight":"";return r`
            <div class="pixel-matching-learner">
                <${c} byteMap=${this.#t} cellSize=${20} isEditable=${!0} />

                <div class="toolbar">
                    <${l} name="Recognise" onClick=${this.#c} />
                    <${l} name="Add to training data" onClick=${this.#h} />
                    <${l} name="Run the test data" onClick=${this.#d} />
                </div>

                <div class="pico">
                    <div role="group">
                        <label>Recognised as:
                            <input class=${s} disabled value=${this.state.recognisedAs} />
                        </label>
                        <label>Correct label:
                            <${I} store=${this.#e} options=${this.#i} canHighlight=${!0} />
                        </label>
                    </div>

                    <h2>Heatmaps</h2>
                    <div class="heatmaps">
                        ${i}
                    </div>

                    <h2>Training data</h2>
                    <div class="carousel">
                        ${e}
                    </div>
                </div>

                <${y} model=${this.#a}>
                    <${M} name="test-results" title="Test results" buttons="OK">
                        <p>
                            You achieved a score of ${this.state.score}% on the training data.
                        </p>
                    <//>
                <//>
            </div>
        `}};var nt=p;export{nt as default};
