"use strict";(self.webpackChunkbasic_shared_resource=self.webpackChunkbasic_shared_resource||[]).push([[26],{3026:(t,e,n)=>{n.r(e),n.d(e,{FusionTopMenu:()=>l,FusionTopMenuButton:()=>h});var s=n(3361),o=n(1762),i=n(752),r=n(1452),a=n(7475),u=n(705),c=n(3291);class h extends i.FusionButton{static get properties(){const{top:t,left:e,...n}=super.properties;return{...n}}static get options(){return{...super.options,componentName:"fusion-top-menu-button",defaultTemplate:"<p>Menu item</p>",isRootNested:!1}}connectedCallback(){super.connectedCallback(),this.init()}init(){this.initListeners(),this.emitCustomEvent(`${this.constructor.options.componentName}:added`)}static goToSlide(t){const e=t.currentTarget.dataset.slide;r.N.goTo(e)}disconnectedCallback(){this.removeEventListener("click",this.constructor.goToSlide.bind(this))}initListeners(){this.addEventListener("click",this.constructor.goToSlide.bind(this))}static get styles(){return[super.styles,s.iv`
        :host {
          left: var(--left);
        }
      `]}}class l extends((0,u.applyMixins)(o.v,[u.SlideComponentBase,u.Stateful,u.EnvDependComponent,c.Container,c.Dimensions,c.Background,c.FieldDefinition])){static get options(){return{...super.options,componentName:"fusion-top-menu",componentUIName:"Top Menu",componentCategory:"menu",componentDescription:"Top menu component to enable navigation in binder",nestedComponents:["fusion-top-menu-button"],baseLevel:100}}static get properties(){const{position:t,top:e,left:n,width:s,height:o,"background-color":i,...r}=super.properties;return{top:{...e,value:"0px"},left:{...n,value:"0px"},width:{...s,value:"1024px"},height:{...o,value:"30px"},"background-color":{...i,value:"rgba(235, 235, 235, 1)"},...r}}toogleMenu(){this.active?this.closeMenu():this.openMenu()}openMenu(){this.pushState(this.state),this.addLevel()}closeMenu(){this.removeState(this.state),this.removeLevel()}constructor(){super(),this.state="Menu",this.defaultButtonPosition={top:0,left:0},this.activeColor="rgba(164,163,163,1)",this.btnAddEvent=`${h.options.componentName}:added`}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(this.btnAddEvent,this.buttonAddHandler.bind(this))}updateWidth(){const{unit:t}=(0,a.RL)(this.width),{offsetWidth:e}=this.parentNode;e&&(this.width=`${e}${t}`)}environmentDataReceived(t){const{slide:e,binder:n}=t.detail;this.closeMenu(),this.updateWidth(),this.addEventListener(this.btnAddEvent,this.buttonAddHandler.bind(this));const s=n?n.slides:[e];this.generateMenuItems(this.constructor.setActiveItem(s,e))}static setActiveItem(t,e){return t.map((t=>(t.active=t.name===e.name,t)))}async generateMenuButton(t,e){let{name:n,active:s}=t;const o=h.properties,i=s?{"background-color":{value:this.activeColor}}:{},a=`<p>${n}</p>`;(await r.N.createElement(h.options.componentName,{...o,width:{value:"200px"},height:{value:"30px"},"data-slide":{value:n},"data-active":{value:s},...i},a,this,`#${this.id}`,{setActive:!1,setState:!1})).style.setProperty("--left",200*e+"px")}removeButtons(){for(;this.lastChild;)this.removeChild(this.lastChild)}generateButtons(t){t.forEach(((t,e)=>{this.generateMenuButton(t,e)}))}getMenuButtons(){const t=h.options.componentName;return this.getElementsByTagName(t)}static isEmpty(t){return 0===t.length}static isDiff(t,e){return t.length>e.length}static needRegenerate(t,e){return this.isEmpty(e)||this.isDiff(t,e)}generateMenuItems(t){const e=this.getMenuButtons();t&&this.constructor.needRegenerate(t,e)&&this.generateButtons(t)}checkSizes(t){(0,a.In)(t,this.constructor.sizeTriggers).size&&this.updateButtonsHeight()}updateButtonsHeight(){const t=Array.from(this.getMenuButtons());if(t&&t.length){const{unit:e}=(0,a.RL)(this.height),n="%"===e?"100%":this.height;this.constructor.changeButtonsHeight(t,n)}}initButtonPosition(t,e){const n=this.getButtonPosition(t);Object.keys(n).forEach((t=>{this.constructor.setStyle(e,t,`${n[t]}px`)})),e.height=this.height}static setStyle(t,e,n){t.style.setProperty(`--${e}`,n)}static getLastButton(t){return t&&t.length>1?t[t.length-2]:null}getButtonPosition(t){if(t){const{offsetLeft:e,offsetWidth:n,offsetTop:s}=t;return{left:e+n,top:s}}return this.defaultButtonPosition}buttonAddHandler(t){const e=t.target,n=this.getMenuButtons(),s=this.constructor.getLastButton(n);this.initButtonPosition(s,e)}static changeButtonsHeight(t,e){t.forEach((t=>{t.height=e}))}static get styles(){return[super.styles,s.iv`
        :host {
          position: absolute;
          display: block;
          transform: translate3d(0, 0, 0);
          transition: transform 0.3s 0s;
          background: var(--background-color);
        }
        :host * {
          margin: 0;
          padding: 0;
        }
        :host(:not([active])){
          transform: translate3d(0, calc(var(--height) * -1), 0) !important;
        }
        [part="handler"] {
          width: 50px;
          height: 15px;
          background: var(--background-color);
          position: absolute;
          top: 100%;
          left: 50%;
          border: 0;
          outline: none;
          border-bottom-left-radius: 50%;
          border-bottom-right-radius: 50%;
          transform:translate3d(-50%, 0 ,0)
        }
        [part="nav"] {
          position: relative;
          height: 100%;
          width: var(--width);
          overflow-x: auto;
          overflow-y: hidden;
        }
        :host(:not(.${(0,s.$m)(u.ModeTrackable.EditModeClassName)}):not([active])) {
            pointer-events: all;
          }
      `]}render(){return super.render(),s.dy`
      <style>
        ${this.dynamicStyles}
      </style>
      <div part="nav">
        <slot></slot>
      </div>
      <button part="handler" @click="${()=>this.toogleMenu()}"></button>
       ${this.constructor.systemSlotTemplate}
    `}}}}]);