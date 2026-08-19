import{C as $,a as d,b as r,g as m,i as p,l as u,p as h,q as v,r as g,s as f,v as w}from"./chunks/ZFPXU6SY.js";import"./chunks/F7WQ4MB3.js";var l=class extends d.Component{#e;#t;#s;#n;constructor(t){super(t),this.state={timestamp:Date.now(),title:""},this.#t=w.primitive(""),this.#s=new v,this.#n=[{time:"8:00"},{time:"9:00"},{time:"10:15"},{time:"11:15"},{time:"13:35"},{time:"14:35"}]}componentDidMount(){this.#e=window.setInterval(this.#i,1e3)}componentWillUnmount(){window.clearInterval(this.#e)}#i=t=>{this.setState({timestamp:Date.now()})};#o=async t=>{await this.#s.open(),this.setState({title:this.#t.getValue()})};#a(t,s){let e=new Date;return new Date(e.getFullYear(),e.getMonth(),e.getDate(),t,s,0,0).getTime()}#r(t){let s=t.indexOf(":");if(s<0)throw new Error(`Invalid time string: ${t}`);let e=m.parseInt(t.substring(0,s)),i=m.parseInt(t.substring(s+1));return this.#a(e,i)}#l(t){let e=864e5,i=null;for(let o of this.#n){let n=this.#r(o.time)-t;n>=-18e5&&n<e&&(e=n,i=o)}return[Math.round(e/1e3),i]}render(){h.loadCss("lesson-starter.css");let t=this.state.timestamp,[s,e]=this.#l(t),i=Math.round(s/1e3),o=null;if(e!==null)if(s>=0){let n=Math.floor(s/60),a=`${s-n*60}`.padStart(2,"0");o=r`
                <p>
                    <div class="countdown">
                        ${n}:${a}
                    </div>
                </p>
            `}else{let n=-s,a=Math.floor(n/60),D=`${n-a*60}`.padStart(2,"0");o=r`
                <p>
                    <div class="countup">
                        ${a}:${D}
                    </div>
                </p>
            `}let c=u.strftime("%A, %d %B, %Y");return r`
            <div class="lesson-starter">
                <div class="settings">
                    <${g} icon="settings" onClick=${this.#o} />
                </div>
                <div class="content">
                    <div class="date">
                        ${c}
                    </div>
                    <div class="title">
                        ${this.state.title}
                    </div>
                    ${o}
                </div>
            </div>
            <${f} title="Set lesson title" buttons="OK" model=${this.#s}>
                <${$} store=${this.#t} />
            <//>
        `}};p.mountApplet("lesson-starter",l);
