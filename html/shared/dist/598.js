"use strict";(self.webpackChunkbasic_shared_resource=self.webpackChunkbasic_shared_resource||[]).push([[598],{5598:(t,e,i)=>{i.r(e),i.d(e,{MJMLColumn:()=>d});var r=i(3712),n=i(520),a=i(3634),o=i(7118),p=i(6283);class d extends((0,a.applyMixins)(n.v,[a.ModeTrackable,a.EmailComponent,a.EmailComponentBaseClasses,p.FieldDefinition,p.AllowLayout])){static get properties(){return{...super.properties,width:{type:String,fieldType:"Number",propertyGroup:"size",value:"100%",availableUnits:[{unitType:"px"},{unitType:"%"}]},"border-radius":{type:String,fieldType:"Number",propertyGroup:"border",value:"0px",availableUnits:[{unitType:"px"},{unitType:"%"}]},"background-color":{type:String,fieldType:"ColorPicker",propertyGroup:"background",value:"rgba(255, 255, 255, 0)"},"vertical-align":{type:String,fieldType:"RadioGroup",propertyGroup:"layout",value:"middle",selectOptions:[{value:"top",icon:"start-horizontal"},{value:"middle",icon:"center-horizontal"},{value:"bottom",icon:"end-horizontal"},{value:"stretch",icon:"stretch-horizontal"}]},"padding-top":{type:String,fieldType:"Number",propertyGroup:"padding",value:"10px",availableUnits:[{unitType:"px"}]},"padding-right":{type:String,fieldType:"Number",propertyGroup:"padding",value:"0px",availableUnits:[{unitType:"px"}]},"padding-bottom":{type:String,fieldType:"Number",propertyGroup:"padding",value:"10px",availableUnits:[{unitType:"px"}]},"padding-left":{type:String,fieldType:"Number",propertyGroup:"padding",value:"0px",availableUnits:[{unitType:"px"}]}}}static getVerticalPosition(){return{top:"flex-start",middle:"center",bottom:"flex-end",stretch:"stretch"}}static get options(){return{...super.options,componentName:"mj-column",componentUIName:"Column container",componentCategory:"container",componentDescription:"Group column container for editor",nestedComponents:["mj-button","mj-divider","mj-image","mj-spacer","mj-text","mj-raw"],dependsOnParent:!0}}applyPosition(){this.style.setProperty("align-self",this.constructor.getVerticalPosition()[this["vertical-align"]])}update(t){super.update(t),t.has("width")&&this.isRendered&&(this.setElementProp("width",this.width),o.X.handleUpdateWidth(this)),t.has("vertical-align")&&this.applyPosition(),t.has("--width")&&this.isRendered&&o.X.alignElementWidthByParent(this)}static get styles(){return[super.styles,r.iv`
        :host {
          display: block;
          width: var(--width);
          max-width: 100%;
          border-radius: var(--border-radius);
          background-color: var(--background-color);
          vertical-align: var(--vertical-align);
        }
        :host .mj-column {
          padding: var(--padding-top) var(--padding-right) var(--padding-bottom) var(--padding-left);
        }
      `]}render(){return r.dy`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class='mj-column'>
        <slot></slot>
      </div>
      ${this.constructor.systemSlotTemplate}
    `}}},7118:(t,e,i)=>{i.d(e,{X:()=>o});var r=i(7329),n=i(1793);class a{static widthConfig(t,e){const{num:i,unit:n}=(0,r.RL)(t),{num:a}=(0,r.RL)(e);return{parentWidth:a,elementWidth:i,unit:n}}static getSuitableWidth(t,e){const{parentWidth:i,elementWidth:r,unit:n}=a.widthConfig(t,e);return`${Math.min(r,i)}${n}`}static getObservableElements(t){return[...t.children].filter((t=>{var e;return null===(e=t.constructor.options)||void 0===e?void 0:e.dependsOnParent}))}alignElementWidthByParent(t,e){const i=getComputedStyle(t.parentNode).width,r=e||getComputedStyle(t).width,n=this.constructor.getSuitableWidth(r,i);t.style.setProperty("--width",n)}static sendRequestUpdate(t){t.requestUpdate("--width",t.width)}handleUpdateWidth(t){const e=a.getObservableElements(t);e?(e.forEach((t=>this.handleUpdateWidth(t))),a.sendRequestUpdate(t)):n.b.log("Nothing to update, EmailAlignImageWidth")}}const o=new a}}]);