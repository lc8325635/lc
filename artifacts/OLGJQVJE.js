import{a as e,b as r,i as s,m as i}from"./chunks/ZFPXU6SY.js";import"./chunks/F7WQ4MB3.js";var p="https://geogebra.org/apps/deployggb.js",n=0,t=class extends e.Component{#t;#o;constructor(o){super(o),this.#t=null,this.#o=`geogebra-${n++}`,this.state={ggProps:{appName:"classic",width:800,height:600,showToolBar:!0,showAlgebraInput:!0,showMenuBar:!0,reloadOnPropChange:!1}}}async#e(){this.#t||(this.scriptId=await i.loadScript(p))}componentDidMount(){new window.GGBApplet(this.state.ggProps,!0).inject(id)}componponentWillUnmount(){}render(){return r`
            <div id=${this.#o}>
                <div id={this.#domId}></div>
            </div>
        `}};s.mountApplet("geogebra",t);
