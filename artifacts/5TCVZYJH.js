import{b as x,c as R,d as v,e as C,j as b,s as k}from"./chunks/OBVZ5JR7.js";import"./chunks/UBMAP5WQ.js";var D=[[0,0,0],[0,1,0],[0,0,0]];function $(i,r,c,f){let d=r.getContext("2d",{willReadFrequently:!0}),o=r.width,l=r.height;d.fillStyle="#000",d.fillRect(0,0,o,l);let h=d.getImageData(0,0,o,l)?.data;for(let m=1;m<o-1;m++)for(let s=1;s<l-1;s++){let e=0;for(let t=0;t<3;t++)for(let a=0;a<3;a++){let g=((m-1+t)*o+(s-1+a))*4;e+=c[g]*f[t][a]}let n=(m*o+s)*4,u=Math.max(0,Math.min(255,Math.round(e)));h[n]=h[n+1]=h[n+2]=u}let I=new ImageData(h,o,l);d.putImageData(I,0,0);let p=i.getContext("2d"),w=i.width,y=i.height;p.imageSmoothingEnabled=!1,p.drawImage(r,0,0,o,l,0,0,w,y)}function F(){let i=v(null),r=v(null),c=v(null),[f,d]=x("tiger"),[o,l]=x(D),[h,I]=x(!1);R(async function(){let e=r.current,n=c.current,u=`images/${f}.png`,t=await b.load(u);e.width=t.width,e.height=t.height,n.width=t.width*2,n.height=t.height*2;let a=e.getContext("2d",{willReadFrequently:!0});a.drawImage(t,0,0);let g=a.getImageData(0,0,t.width,t.height)?.data;i.current=g,$(n,e,g,o)},[f]);function p(e,n,u){let t=[];for(let a of o)t.push(Array.from(a));t[e][n]=u,l(t)}function w(){c.current&&r.current&&i.current&&$(c.current,r.current,i.current,o)}function y(){c.current&&r.current&&i.current&&$(c.current,r.current,i.current,D)}function m(e){d(e.target.value)}let s=[];for(let e=0;e<3;e+=1)for(let n=0;n<3;n+=1){let u=`${e},${n}`,t=o[e][n],a=C`
                <input
                    key=${u}
                    type="text"
                    inputmode="decimal"
                    pattern="[0-9.]*"
                    value=${t}
                    onChange=${g=>p(e,n,g.currentTarget.value)}
                />
            `;s.push(a)}return k.loadCss({path:"js/applets/convolution-editor/convolution-editor.css",content:`.convolution-editor {
    .matrix {
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 4px;

        max-width: 20rem;

        padding: 1rem;
        background: black;
        color: white;

        input {
            text-align: center;
            height: 3rem;
        }
    }

    canvas {
        display: block;
        margin: 0 auto;
    }
}
`}),C`
        <div class="convolution-editor">
            <canvas ref=${r} class="hidden" />
            <article>
                <header>Convolution matrix</header>
                <div class="matrix">${s}</div>
                <footer role="group">
                    <button onClick=${w}>Apply Filter</button>
                    <button onClick=${y} class="secondary">Show original</button>
                </footer>
            </article>
            <article>
                <canvas ref=${c} />
                <footer>
                    <label>Current picture:
                        <select name="select" onchange=${m}>
                            <option value="tiger">Tiger</option>
                            <option value="flowers">Flowers</option>
                        </select>
                    </label>
                </footer>
            </article>
        </div>
    `}var j=F;export{j as default};
