import{c as o,g as i}from"./chunks/2F6KTMXK.js";import"./chunks/UBMAP5WQ.js";var n=class extends o.Component{constructor(t){super(t),this.state={},this.#t(t.children)}#t(t){let s=t.querySelectorAll("section");this.setState({rootNode:t,currentSlide:0,totalSlides:s.length})}componentDidMount(){document.addEventListener("keydown",this.#e),this.updateSlideCount(),this.updateDates()}componentWillUnmount(){document.removeEventListener("keydown",this.#e)}updateDates(){let t=this.state.rootNode.querySelectorAll(".auto-date"),s=new Date().toLocaleDateString("zh-CN",{year:"numeric",month:"long",day:"numeric",weekday:"long"});t.forEach(r=>r.textContent=s)}#e=t=>{e.key==="ArrowRight"&&this.next(),e.key==="ArrowLeft"&&this.prev(),(e.key==="f"||e.key==="F")&&this.toggleFullscreen()};next(){this.state.currentSlide<this.state.totalSlides-1&&this.setState({currentSlide:this.state.currentSlide+1})}prev(){this.state.currentSlide>0&&this.setState({currentSlide:this.state.currentSlide-1})}toggleFullscreen(){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}render(){let s=`translateX(-${this.state.currentSlide*100}%)`,r={__html:this.state.rootNode};return i`
            <div class="slide-deck" ref={this.containerRef}>
                <div class="slides-container"
                    style=${s}
                    dangerouslySetInnerHTML=${r}
                />

                <div class="slide-nav">
                  ${this.state.currentSlide+1} / ${this.state.totalSlides}
                </div>
            </div>
        `}render(){return i`
            <div class="slideshow">
                ${props.children}
            </div>
        `}};var S=n;export{S as default};
