"use strict";(self.webpackChunkbasic_shared_resource=self.webpackChunkbasic_shared_resource||[]).push([[197],{3197:(e,t,i)=>{i.r(t),i.d(t,{MJMLGroup:()=>o});var n=i(3712),r=i(520),p=i(3634),a=i(7118),s=i(6283);class o extends((0,p.applyMixins)(r.v,[p.EmailComponent,p.EmailComponentBaseClasses,s.FieldDefinition])){static get properties(){return{...super.properties,width:{type:String,fieldType:"Number",propertyGroup:"size",value:"100%",availableUnits:[{unitType:"px"},{unitType:"%"}]},"background-color":{type:String,fieldType:"ColorPicker",propertyGroup:"background",value:"rgba(255, 255, 255, 0)"},"padding-top":{type:String,fieldType:"Number",propertyGroup:"padding",value:"0px",availableUnits:[{unitType:"px"}]},"padding-right":{type:String,fieldType:"Number",propertyGroup:"padding",value:"0px",availableUnits:[{unitType:"px"}]},"padding-bottom":{type:String,fieldType:"Number",propertyGroup:"padding",value:"0px",availableUnits:[{unitType:"px"}]},"padding-left":{type:String,fieldType:"Number",propertyGroup:"padding",value:"0px",availableUnits:[{unitType:"px"}]}}}static get options(){return{...super.options,componentName:"mj-group",componentUIName:"Group container",componentCategory:"container",componentDescription:"Email group component",nestedComponents:["mj-column"],dependsOnParent:!0}}update(e){super.update(e),e.has("width")&&this.isRendered&&(this.setElementProp("width",this.width),a.X.handleUpdateWidth(this)),e.has("--width")&&this.isRendered&&a.X.alignElementWidthByParent(this)}static get styles(){return[super.styles,n.iv`
        :host {
          width: var(--width);
          display: block;
          min-height: 20px;
          background-color: var(--background-color);
        }
        slot {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: flex-start;
        }
      `]}render(){return n.dy`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class='mj-group'>
        <slot></slot>
      </div>
      ${this.constructor.systemSlotTemplate}
    `}}},7118:(e,t,i)=>{i.d(t,{X:()=>a});var n=i(7329),r=i(1793);class p{static widthConfig(e,t){const{num:i,unit:r}=(0,n.RL)(e),{num:p}=(0,n.RL)(t);return{parentWidth:p,elementWidth:i,unit:r}}static getSuitableWidth(e,t){const{parentWidth:i,elementWidth:n,unit:r}=p.widthConfig(e,t);return`${Math.min(n,i)}${r}`}static getObservableElements(e){return[...e.children].filter((e=>{var t;return null===(t=e.constructor.options)||void 0===t?void 0:t.dependsOnParent}))}alignElementWidthByParent(e,t){const i=getComputedStyle(e.parentNode).width,n=t||getComputedStyle(e).width,r=this.constructor.getSuitableWidth(n,i);e.style.setProperty("--width",r)}static sendRequestUpdate(e){e.requestUpdate("--width",e.width)}handleUpdateWidth(e){const t=p.getObservableElements(e);t?(t.forEach((e=>this.handleUpdateWidth(e))),p.sendRequestUpdate(e)):r.b.log("Nothing to update, EmailAlignImageWidth")}}const a=new p}}]);