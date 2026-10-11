import{D as a,E as l,a as t,e as o,t as r,y as i,z as s}from"./chunks/CG5B4ACS.js";import"./chunks/UBMAP5WQ.js";var e=class extends t.Component{#n;#e;constructor(n){super(n),this.#n=s.PrimitiveStore.of()}componentDidMount(){this.#n.addAndFireListener(this.onSelectFilepath)}componentWillUnmount(){this.#n.removeListener(this.onSelectFilepath)}onSelectFilepath=n=>{i.setPageVariable("activeFilename",n.newValue)};render(){let{gfx:n,...m}=this.props;r.loadCss({path:"js/applets/minide/minide.css",content:`.minide {
    & .code-editor {
        & .toolbar {
            display: grid;
            grid-template-columns: 3fr 1fr 1fr 1fr 1fr 1fr;
            grid-template-rows: 1fr;
            grid-column-gap: 0.125rem;
            padding: 0.25rem 0;

            button {
                margin: 0;
                padding-top: 0;
                padding-bottom: 0;
            }

            select {
                margin: 0;
                padding-top: 0;
                padding-bottom: 0;
            }
        }

        & .stats {
            text-align: right;
            font-size: small;
        }

        & canvas {
            display: block;
            margin: 0 auto;
            overflow: scroll;
        }
    }

    & .terminal {
        display: flex;
        flex-flow: column nowrap;
        background: black;
        height: 12rem;
        color: white;

        & div.content {
            overflow-x: hidden;
            overflow-y: scroll;
            flex-grow: 1;
            font-family: monospace;
            font-size: 1rem;
            white-space: pre;

            & .stdout {
                color: green;
            }

            & .stderr {
                color: red;
            }
        }

        & input.terminal-input {
            background: white;
            color: black;
            margin: 0;
            border: 0;
            padding: 0;
            transition: background 0.5s ease-in-out;
        }

        & input.terminal-input:disabled {
            background: black;
        }
    }
}
`});let d=this.props["prelude-files"];return o`
            <div class="minide">
                <${a} files=${this.props.files} filepathStore=${this.#n} />
                <${l} filepathStore=${this.#n} preludes=${d} gfx=${n} />
            </div>
        `}};var S=e;export{S as default};
