import{b as C,d as x,e as R,f as v,i as D,j as b,p as F}from"./chunks/ZFPXU6SY.js";import"./chunks/F7WQ4MB3.js";var M=[[0,0,0],[0,1,0],[0,0,0]];function $(a,r,c,h){let m=r.getContext("2d",{willReadFrequently:!0}),n=r.width,l=r.height;m.fillStyle="#000",m.fillRect(0,0,n,l);let f=m.getImageData(0,0,n,l)?.data;for(let d=1;d<n-1;d++)for(let s=1;s<l-1;s++){let e=0;for(let t=0;t<3;t++)for(let i=0;i<3;i++){let g=((d-1+t)*n+(s-1+i))*4;e+=c[g]*h[t][i]}let o=(d*n+s)*4,u=Math.max(0,Math.min(255,Math.round(e)));f[o]=f[o+1]=f[o+2]=u}let I=new ImageData(f,n,l);m.putImageData(I,0,0);let p=a.getContext("2d"),w=a.width,y=a.height;p.imageSmoothingEnabled=!1,p.drawImage(r,0,0,n,l,0,0,w,y)}function k(){let a=v(null),r=v(null),c=v(null),[h,m]=x("tiger"),[n,l]=x(M),[f,I]=x(!1);R(async function(){let e=r.current,o=c.current,u=`images/${h}.png`,t=await b.load(u);e.width=t.width,e.height=t.height,o.width=t.width*2,o.height=t.height*2;let i=e.getContext("2d",{willReadFrequently:!0});i.drawImage(t,0,0);let g=i.getImageData(0,0,t.width,t.height)?.data;a.current=g,$(o,e,g,n)},[h]);function p(e,o,u){let t=[];for(let i of n)t.push(Array.from(i));t[e][o]=u,l(t)}function w(){c.current&&r.current&&a.current&&$(c.current,r.current,a.current,n)}function y(){c.current&&r.current&&a.current&&$(c.current,r.current,a.current,M)}function d(e){m(e.target.value)}let s=[];for(let e=0;e<3;e+=1)for(let o=0;o<3;o+=1){let u=`${e},${o}`,t=n[e][o],i=C`
                <input
                    key=${u}
                    type="text"
                    inputmode="decimal"
                    pattern="[0-9.]*"
                    value=${t}
                    onChange=${g=>p(e,o,g.currentTarget.value)}
                />
            `;s.push(i)}return F.loadCss("convolution-editor.css"),C`
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
                        <select name="select" onchange=${d}>
                            <option value="tiger">Tiger</option>
                            <option value="flowers">Flowers</option>
                        </select>
                    </label>
                </footer>
            </article>
        </div>
    `}D.mountApplet("convolution-editor",k);export{k as ConvolutionEditor};
