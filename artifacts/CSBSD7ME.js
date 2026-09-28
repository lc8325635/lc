import{A as c,H as d,a as t,e as o,r as i,t as s,v as a,w as l,y as p,z as m}from"./chunks/OBVZ5JR7.js";import"./chunks/UBMAP5WQ.js";var e=class extends t.Component{constructor(r){super(r)}render(){return o`
            <div class="info-panel">
                <div class="shrink">
                    <img src="../../../img/applets/datacentre-simulator/${this.props.img}.png" />
                </div>
                <div class="grow">
                    ${this.props.children}
                </div>
            </div>
        `}};var f=signal();function h(){f.value=1e7}h();var n=class extends t.Component{#t;#e;#o;constructor(r){super(r),this.#t=new s,this.#e=new c,this.#o=p.PrimitiveStore.of(""),this.state={money:0}}componentDidMount(){this.#t.open("introduction")}componentWillUnmount(){}render(){return i({path:"js/applets/datacentre-simulator/datacentre-simulator.css",content:`.datacentre-simulator {
    position: relative;

    .ui-overlay {
        position: absolute;
        inset: 0;
    }

    .info-panel {
        display: flex;
        justify-content: stretch;
        gap: 8px;

        .shrink {
            flex-shrink: 0;

            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            align-items: center;
        }

        .grow {
            flex-grow: 1;
            overflow-y: auto;
        }
    }
}
`}),o`
            <div class="datacentre-simulator">
                <${m} width=${400} height=${400} />
                <div class="ui-overlay">
                    <p>Money: €${this.state.money.toLocaleString()}</p>
                </div>
                <${a} model=${this.#t}>
                    <${l} name="introduction" title="Introduction" buttons="Next">
                        <${d} store=${this.#o} />
                        <${e} img="workman">
                            <p>
                                Hello and welcome to datacentre simulator!
                            </p>
                            <p>
                                This simulation makes you project manager at a
                                software company that wants to expand into the
                                datacentre business.
                            </p>
                            <p>
                                You will receive an initial budget
                                of €<b>${this.state.money.toLocaleString()}</b> to
                                start construction of your first
                                datacentre.
                            </p>
                        <//>
                    <//>
                <//>
            </div>
        `}};var P=n;export{P as default};
