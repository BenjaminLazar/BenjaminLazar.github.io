"use strict";(self.webpackChunkbasic_shared_resource=self.webpackChunkbasic_shared_resource||[]).push([[275],{9275:(t,e,o)=>{o.r(e),o.d(e,{FusionInfoTab:()=>b});var i=o(3712),a=o(520),n=o(3634),r=o(7329),s=o(6283);const p="InfoTab";class b extends((0,n.applyMixins)(a.v,[n.SlideComponentBase,s.Container,s.Dimensions,n.Stateful,s.Display,n.ModeTrackable,s.FieldDefinition])){static get properties(){const{top:t,left:e,width:o,height:i,"padding-top":a,"padding-right":n,"padding-bottom":r,"padding-left":s,overflow:p,"min-width":b,"min-height":d,...l}=super.properties;return{top:t,left:e,width:{...o,value:"400px",availableUnits:[{unitType:"px"}]},height:{...i,value:"400px",availableUnits:[{unitType:"px"}]},...l,"tab-width":{type:String,fieldType:"Number",propertyGroup:"infotab",value:"40px",min:20,availableUnits:[{unitType:"px"},{unitType:"%"}]},"tab-height":{type:String,fieldType:"Number",propertyGroup:"infotab",value:"60px",min:40,availableUnits:[{unitType:"px"},{unitType:"%"}]},"tab-placement":{type:String,fieldType:"Select",propertyGroup:"infotab",value:"Middle",prop:!0,selectOptions:["Top","Middle","Bottom"]},"tab-position":{type:String,fieldType:"Select",propertyGroup:"infotab",value:"Right",prop:!0,selectOptions:["Left","Right"]},"transition-duration":{type:String,fieldType:"Number",propertyGroup:"infotab",value:"800ms",availableUnits:[{unitType:"ms"}]},"background-color":{type:String,fieldType:"ColorPicker",propertyGroup:"infotab",value:"rgba(20, 38, 46, 1)"},"min-width":{...b,value:"400px"},"min-height":{...d,value:"70px"}}}static get options(){return{...super.options,componentName:"fusion-infotab",componentUIName:"Infotab",componentType:"dynamic",componentCategory:"overlay",componentDescription:"Sliding container intended for placement at any edge of the content",baseLevel:100,isTextEdit:!0}}enter(){this.addLevel(),this.emitCustomEvent("open")}exit(){const t=(0,r.RL)(this["transition-duration"]).num;this.removeLevel(t),this.emitCustomEvent("close")}static get state(){return p}constructor(){super(),this.state=p,this.toggleBinded=this.toggle.bind(this)}disconnectedCallback(){super.disconnectedCallback(),this.setListenerType("removeEventListener")}toggle(){this.active?this.inactivate():this.activate()}firstUpdated(t){super.firstUpdated(t),this.container=this.shadowRoot.querySelector(".info-tab"),this.content=this.shadowRoot.querySelector(".info-tab-content"),this.tab=this.shadowRoot.querySelector("[name='tab']"),this.setListenerType("addEventListener")}setListenerType(t){this.tab[t]("click",this.toggleBinded)}static get styles(){return[super.styles,i.iv`
        :host .info-tab {
          position: absolute;
          width: var(--width);
          height: var(--height);
        }
        :host(:not(.${(0,i.$m)(n.ModeTrackable.EditModeClassName)})) {
          pointer-events: none;
        }
        :host [name='tab'] {
          position: absolute;
          width: var(--tab-width);
          height: var(--tab-height);
          border: 1px solid transparent;
          background-color: var(--background-color);
          user-select: none;
          cursor: pointer;
          box-sizing: border-box;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          pointer-events: all;
        }
        :host [name='tab']:before,
        :host [name='tab']:after {
          content: '';
          position: absolute;
          width: 3px;
          height: 3px;
          border: 6px solid var(--background-color);
        }
        :host [name='tab']:before {
          top: -4px;
        }
        :host [name='tab']:after {
          bottom: -4px;
        }
        :host [name='tab']:focus {
          outline: 0;
        }
        :host .info-tab-content {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: var(--background-color);
          box-sizing: border-box;
          pointer-events: all;
        }
        :host([tab-placement='Top']) [name='tab'] {
          top: 5px;
        }
        :host([tab-placement='Bottom']) [name='tab'] {
          bottom: 5px;
        }
      `]}getTabHandlerPositionStyle(){switch(this["tab-placement"]){case"Top":return i.dy`:host [name='tab'] { top: 5px; }`;case"Bottom":return i.dy`:host [name='tab'] { bottom: 5px; }`;default:return i.dy`:host [name='tab'] { top: 50%; transform: translateY(-50%); }`}}getTabHandlerCornersStyle(){return"Left"===this["tab-position"]?i.dy`:host [name='tab']:before { border-width: 0 2px 2px 0 !important;} :host [name='tab']:after { border-width: 2px 2px 0 0 !important; }`:i.dy`:host [name='tab']:before { border-width: 0 0 2px 2px !important; } :host [name='tab']:after { border-width: 2px 0 0 2px !important; }`}get dynamicStyles(){const t=this["tab-position"].toLowerCase(),e="right"===t?"left":"right";return i.dy`
      ${super.dynamicStyles}
        :host .info-tab {
          ${e}: calc(var(--width) * -1);
          transition: ${e} var(--transition-duration), transform var(--transition-duration);
        }
        :host [name='tab'] {
          ${t}: calc(calc(var(--tab-width) - 1px) * -1);
          border-bottom-${t}-radius: 18px;
          border-top-${t}-radius: 18px;
        }
        :host [name='tab']:before,
        :host [name='tab']:after {
          ${e}: -3px;
        }
        :host [name='tab']:before {
          border-bottom-${e}-radius: 100%;
        }
        :host [name='tab']:after {
          border-top-${e}-radius: 100%;
        }
        :host .info-tab-content {
          ${e}: 0;
        }
        :host([active]) .info-tab {
          ${e}: 0;
        }
        ${this.getTabHandlerPositionStyle()}
        ${this.getTabHandlerCornersStyle()}
    `}render(){return i.dy`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class='info-tab'>
        <button name='tab'></button>
        <div class='info-tab-content'><slot></slot></div>
      </div>
      ${this.constructor.systemSlotTemplate}
    `}}}}]);