"use strict";(self.webpackChunkbasic_shared_resource=self.webpackChunkbasic_shared_resource||[]).push([[703],{3703:(e,t,i)=>{i.r(t),i.d(t,{MJMLImage:()=>p});var r=i(3361),s=i(1762),n=i(7475),o=i(705),a=i(713),d=i(3291);class p extends((0,o.applyMixins)(s.v,[o.ModeTrackable,o.LinkExtension,o.EmailComponent,o.EmailComponentBaseClasses,o.ContentModule,d.FieldDefinition])){static get properties(){const{"should-shown":e,...t}=super.properties;return{...t,"should-shown":{...e,value:!0},width:{type:String,fieldType:"Number",propertyGroup:"size",value:"400px",prop:!0,availableUnits:[{unitType:"px"}]},src:{type:String,fieldType:"Modal",propertyGroup:"image",value:"https://cdn.activator.cloud/assets/placeholder.jpg",prop:!0,assetType:"Image"},"container-background-color":{type:String,fieldType:"ColorPicker",propertyGroup:"background",value:"rgba(255, 255, 255, 0)"},"padding-top":{type:String,fieldType:"Number",propertyGroup:"padding",value:"0px",availableUnits:[{unitType:"px"}]},"padding-right":{type:String,fieldType:"Number",propertyGroup:"padding",value:"0px",availableUnits:[{unitType:"px"}]},"padding-bottom":{type:String,fieldType:"Number",propertyGroup:"padding",value:"0px",availableUnits:[{unitType:"px"}]},"padding-left":{type:String,fieldType:"Number",propertyGroup:"padding",value:"0px",availableUnits:[{unitType:"px"}]},align:{type:String,fieldType:"RadioGroup",propertyGroup:"layout",value:"center",selectOptions:[{value:"left",icon:"start-vertical"},{value:"center",icon:"center-vertical"},{value:"right",icon:"end-vertical"}]},"border-color":{type:String,fieldType:"ColorPicker",propertyGroup:"border",value:"rgba(255, 255, 255, 0)"},"border-width":{type:String,fieldType:"Number",propertyGroup:"border",value:"0px",availableUnits:[{unitType:"px"}]},"border-radius":{type:String,fieldType:"Number",propertyGroup:"border",value:"0px",availableUnits:[{unitType:"px"},{unitType:"%"}]},"hidden-on-mobile":{type:Boolean,fieldType:"Boolean",propertyArea:"settings",propertyGroup:"image",value:!1,prop:!0},"fluid-on-mobile":{type:Boolean,fieldType:"Boolean",propertyGroup:"image",value:!1},alt:{type:String,fieldType:"String",propertyArea:"settings",propertyGroup:"image",value:"Image"}}}static get options(){return{...super.options,componentName:"mj-image",componentContentType:"image",componentUIName:"image container",componentDescription:"Image container for editor",nestedComponents:[],dependsOnParent:!0}}getBorder(){return`${this["border-width"]} solid ${this["border-color"]}`}setBorder(){this.border=this.getBorder(),this.setAttribute("border",this.border)}updateMobileVisibility(){if(this["hidden-on-mobile"]&&!this["css-class"].includes("act-mob-hidden")&&(this["css-class"]=this["css-class"].length?`${this["css-class"]} act-mob-hidden`:"act-mob-hidden"),!this["hidden-on-mobile"]&&this["css-class"].includes("act-mob-hidden")){const e=this["css-class"].split(" "),t=e.indexOf("act-mob-hidden");e.splice(t,1),this["css-class"]=e.join(" ")}}mobileVisibilityHandler(e){(e.has("hidden-on-mobile")||e.has("css-class"))&&this.updateMobileVisibility()}setContentModule(e){this.setAttribute("src",e)}firstUpdated(e){if(super.firstUpdated(e),!this.style.getPropertyValue("--width")&&this.parentNode){const e=getComputedStyle(this.parentNode).width,{num:t,unit:i}=(0,n.RL)(e);this.setAttribute("width",`${t}${i}`)}}updated(e){super.updated(e),this.mobileVisibilityHandler(e),e.has("width")&&this.isRendered&&a.X.handleUpdateWidth(this),e.has("--width")&&this.isRendered&&a.X.alignElementWidthByParent(this,this.width)}getHorAlign(){return{center:"center",left:"flex-start",right:"flex-end"}[this.align]}static get styles(){return[super.styles,r.iv`
        :host {
          width: 100%;
          display: block;
          background-color: var(--container-background-color);
        }
         :host .image-container img {
           width: var(--width);
          height: auto;
          border: var(--border-width) solid var(--border-color);
          border-radius: var(--border-radius);
          padding: var(--padding-top) var(--padding-right) var(--padding-bottom) var(--padding-left);
        }
        :host .image-container {
          display: flex;
          align-items: center;
          box-sizing: border-box;
        }
        :host slot[name="mo-system"] .main {
          position: absolute;
          top: 0;
        }
      `]}get dynamicStyles(){return r.dy`
      ${super.dynamicStyles}
      :host .image-container {
        justify-content: ${this.getHorAlign()};
      }
    `}render(){return this.setBorder(),r.dy`
      <style>
        ${this.dynamicStyles}
        :host .image-container {
          justify-content: ${this.getHorAlign()};
        }
      </style>
      <div class="image-container">
         <img src=${this.src||""} alt=${this.alt} @click='${()=>this.openLink()}'>
      </div>
      ${this.constructor.systemSlotTemplate}
    `}}},713:(e,t,i)=>{i.d(t,{X:()=>o});var r=i(7475),s=i(8388);class n{static widthConfig(e,t){const{num:i,unit:s}=(0,r.RL)(e),{num:n}=(0,r.RL)(t);return{parentWidth:n,elementWidth:i,unit:s}}static getSuitableWidth(e,t){const{parentWidth:i,elementWidth:r,unit:s}=n.widthConfig(e,t);return`${Math.min(r,i)}${s}`}static getObservableElements(e){return[...e.children].filter((e=>{var t;return null===(t=e.constructor.options)||void 0===t?void 0:t.dependsOnParent}))}alignElementWidthByParent(e,t){const i=getComputedStyle(e.parentNode).width,r=t||getComputedStyle(e).width,s=this.constructor.getSuitableWidth(r,i);e.style.setProperty("--width",s)}static sendRequestUpdate(e){e.requestUpdate("--width",e.width)}handleUpdateWidth(e){const t=n.getObservableElements(e);t?(t.forEach((e=>this.handleUpdateWidth(e))),n.sendRequestUpdate(e)):s.b.log("Nothing to update, EmailAlignImageWidth")}}const o=new n}}]);