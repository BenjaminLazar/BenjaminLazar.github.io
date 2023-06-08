"use strict";(self.webpackChunkbasic_shared_resource=self.webpackChunkbasic_shared_resource||[]).push([[386],{8386:(t,e,s)=>{s.r(e),s.d(e,{FusionPaint:()=>d});var i=s(3361),o=s(1762),n=s(1452),r=s(9455),a=s(705),h=s(7475),c=s(3291);const l="PaintTool";class d extends((0,a.applyMixins)(o.v,[a.SlideComponentBase,c.Container,c.Dimensions,c.Display,c.Background,a.Stateful,a.ModeTrackable,c.FieldDefinition])){static get properties(){const{position:t,top:e,left:s,width:i,height:o,opacity:n,"background-color":r}=super.properties;return{position:t,top:e,left:s,width:{...i,min:400},height:{...o,value:"70px",min:70},"background-color":{...r,value:"rgba(230, 230, 230, 1)"},opacity:n}}static get options(){return{...super.options,componentName:"fusion-paint",componentUIName:"Paint",componentType:"dynamic",componentCategory:"interaction",componentDescription:"Basic paint component",nestedComponents:[],baseLevel:1e3}}static get state(){return l}constructor(){super(),this.state=l,this.newStyle=[],this.preparingToDrawBound=this.preparingToDraw.bind(this),this.drawingBound=this.drawing.bind(this),this.endDrawBound=this.endDraw.bind(this),this.clearDrawBound=this.clearDraw.bind(this),this.setActiveBound=this.setActive.bind(this),this.listenerMap=new Map}editorModeChanged(t){this.canvas&&(this.disableInEditMode(t),this.clearDraw())}disconnectedCallback(){super.disconnectedCallback(),this.setListenerType("removeEventListener"),this.listenerMap.forEach(((t,e)=>e.removeEventListener("click",t))),this.canvas.remove()}enter(){this.addLevel(),this.setCanvasStyle("active")}exit(){this.removeLevel(),this.setCanvasStyle("inactive")}setCanvasStyle(t){const e=this.getCanvasInlineStyle(t);Object.keys(e).forEach((t=>this.canvas.style.setProperty(t,e[t])))}getCanvasLevel(){return window.getComputedStyle(this).getPropertyValue("--level")}getCanvasInlineStyle(t){return{active:{"z-index":this.getCanvasLevel(),"pointer-events":"all"},inactive:{"z-index":this.getCanvasLevel(),"pointer-events":"none"}}[t]}createCanvas(){this.parent=document.querySelector(r.rootSelector.slide),this.canvas=document.createElement("canvas"),this.canvas.setAttribute("width",this.parent.offsetWidth||1024),this.canvas.setAttribute("height",this.parent.offsetHeight||768),this.canvas.setAttribute("id",`canvas-${this.id}`),this.canvas.style.setProperty("position","absolute"),this.canvas.style.setProperty("top",0),this.canvas.style.setProperty("left",0),this.parent.appendChild(this.canvas)}initPen(){this.context=this.canvas.getContext("2d"),this.context.lineCap="round",this.context.lineJoin="round",this.context.strokeStyle=this.constructor.getColor()[this.color],this.context.lineWidth=this.constructor.getSize()[this.size]}static getTarget(t){return n.N.isTouchSupported?t.targetTouches[0]:t}preparingToDraw(t){t.preventDefault(),this.target=this.constructor.getTarget(t),this.initPen(),this.isDrawing=!0,this.lastPoint={x:this.target.pageX,y:this.target.pageY}}disableInEditMode(t){t?this.setCanvasStyle("inactive"):this.setCanvasStyle("active")}drawing(t){this.target=this.constructor.getTarget(t),this.active&&this.isDrawing&&(this.context.beginPath(),this.context.moveTo(this.lastPoint.x,this.lastPoint.y),this.context.lineTo(this.target.pageX,this.target.pageY),this.context.stroke(),this.lastPoint={x:this.target.pageX,y:this.target.pageY})}endDraw(){this.isDrawing=!1,this.lastPoint=null}clearDraw(){this.context&&this.context.clearRect(0,0,this.parent.offsetWidth,this.parent.offsetHeight)}setListenerType(t){this.shadowRoot.querySelector("[name=eraser]")[t](this.events.startEvent,this.clearDrawBound),this.canvas[t](this.events.upEvent,this.endDrawBound),this[t](this.events.upEvent,this.endDrawBound),this.canvas[t](this.events.startEvent,this.preparingToDrawBound),this.canvas[t](this.events.moveEvent,this.drawingBound)}createPaintTools(){this.size="normal",this.color="green",this.createElementsByName("size",this.constructor.getSize()),this.createElementsByName("color",this.constructor.getColor())}static getSize(){return{huge:21,large:15,normal:9,small:3}}static getColor(){return{green:"rgba(0, 190, 50, 1)",red:"rgba(255, 0, 0, 1)",yellow:"rgba(255, 205, 0, 1)",purple:"rgba(215, 0, 250, 1)"}}createElementsByName(t,e){Object.keys(e).forEach((e=>this.createElementForDraw(t,e)))}createElementForDraw(t,e){const s=document.createElement("div");s.setAttribute("id",e);this.shadowRoot.querySelector(`[name=${t}]`).appendChild(s),this.listenerMap.set(s,this.setActiveBound.bind(null,t,e)),this.shadowRoot.getElementById(e).addEventListener("click",this.listenerMap.get(s))}setActive(t,e){"color"===t?this.constructor.setActiveColor.bind(this)(e):this.constructor.setActiveSize.bind(this)(t,e),this[t]=e}static setActiveColor(t){this.shadowRoot.getElementById(this.size).style.setProperty("border-color",this.constructor.getColor()[t])}static setActiveSize(t,e){this.shadowRoot.getElementById(this[t]).style.setProperty("border-color",""),this.shadowRoot.getElementById(e).style.setProperty("border-color",this.constructor.getColor()[this.color])}setPropOfElement(t,e,s){const{num:i,unit:o}=(0,h.RL)(t),n=Math.max(i,s);this.setElementProp(e,`${n}${o}`)}firstUpdated(t){super.firstUpdated(t),this.events=n.N.getEventsPreset(),this.createCanvas(),this.createPaintTools(),this.setListenerType("addEventListener"),this.shadowRoot.getElementById(this.size).style.setProperty("border-color",this.constructor.getColor()[this.color])}static get styles(){const t=Object.keys(this.getColor()).map((t=>i.iv`#${(0,i.$m)(t)}:before {
        background: ${(0,i.$m)(this.getColor()[t])};
      }`)),e=Object.keys(this.getSize()).map((t=>i.iv`#${(0,i.$m)(t)}:before {
       width: ${(0,i.$m)(this.getSize()[t])}px; 
       height: ${(0,i.$m)(this.getSize()[t])}px; 
      }`));return[super.styles,i.iv`
        :host {
          z-index: calc(var(--level) + 10);
          display: none;
        }
        :host([active]) {
            display: block;
        }
        :host [name='paint-container'],
        :host [name='tools-set'] {
          width: 100%;
          height: 100%;
        }
        :host [name='tools-set'] {
          background-color: var(--background-color);
        }
        :host [name='tools-set'] {
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
        }
        :host [name='color'],
        :host [name='size'],
        :host [name='eraser']{
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        :host [name='color'],
        :host [name='size'] {
          width: 42%;
        }
        :host [name='color'],
        :host [name='size'],
        :host [name='eraser'] {
          height: 90%;
        }
        :host [name='eraser'] {
          width: 14%;
        }
        :host [name='color']:before,
        :host [name='size']:before,
        :host [name='eraser']:before {
          content: '';
          position: absolute;
          width: 96%;
          height: 96%;
          background-color: #fff;
          border-radius: 10px;
        }
        :host [name='color'] > div,
        :host [name='size'] > div {
          position: relative;
          width: 37px;
          height: 37px;
          border-color: #b3b3b3;
        }
        :host [name='color'] > div:before,
        :host [name='size'] > div:before {
          content: '';
          position: absolute;
          width: 60%;
          height: 60%;
          border-radius: 50%;
          border: 1px solid;
          border-color: inherit;
          top: 50%;
          left: 50%;
          transform: translate3d(-50%, -50%, 0);
        }
        :host [name='eraser']:before {
          width: 90%;
          background: #fff url(../shared/src/fusion/slide/paint/assets/images/fusion-eraser.png) center / 28px no-repeat;
        }
        :host(.${(0,i.$m)(a.ModeTrackable.EditModeClassName)}) [name='paint-container'] {
          pointer-events: none;
        }
      `,...t,...e]}render(){return i.dy`
      <style>
        ${this.dynamicStyles}
      </style>
      <div name='paint-container'>
        <div name='tools-set'>
          <div name='color'></div>
          <div name='size'></div>
          <div name='eraser'></div>
        </div>
      </div>
      ${this.constructor.systemSlotTemplate}
    `}}}}]);