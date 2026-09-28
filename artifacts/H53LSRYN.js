import{a as r,e,m as s}from"./chunks/OBVZ5JR7.js";import"./chunks/UBMAP5WQ.js";var i="https://geogebra.org/apps/deployggb.js",p=0,t=class extends r.Component{#t;#o;constructor(o){super(o),this.#t=null,this.#o=`geogebra-${p++}`,this.state={ggProps:{appName:"classic",width:800,height:600,showToolBar:!0,showAlgebraInput:!0,showMenuBar:!0,reloadOnPropChange:!1}}}async#r(){this.#t||(this.scriptId=await s.loadScript(i))}componentDidMount(){new window.GGBApplet(this.state.ggProps,!0).inject(id)}componponentWillUnmount(){}render(){return e`
            <div id=${this.#o}>
                <div id={this.#domId}></div>
            </div>
        `}};var w=t;export{w as default};
