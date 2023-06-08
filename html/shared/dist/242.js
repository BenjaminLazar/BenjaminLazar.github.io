"use strict";(self.webpackChunkbasic_shared_resource=self.webpackChunkbasic_shared_resource||[]).push([[242,89],{2089:(e,t,r)=>{r.r(t),r.d(t,{MJMLSection:()=>p});var i=r(3712),o=r(520),n=r(3634),a=r(6283);class p extends((0,n.applyMixins)(o.v,[n.ModeTrackable,n.EmailComponent,n.EmailComponentBaseClasses,a.FieldDefinition])){static get properties(){return{...super.properties,"border-radius":{type:String,fieldType:"Number",propertyGroup:"border",value:"0px",availableUnits:[{unitType:"px"},{unitType:"%"}]},"background-color":{type:String,fieldType:"ColorPicker",propertyGroup:"background",value:"rgba(255, 255, 255, 0)"},"padding-top":{type:String,fieldType:"Number",propertyGroup:"padding",value:"20px",availableUnits:[{unitType:"px"}]},"padding-right":{type:String,fieldType:"Number",propertyGroup:"padding",value:"0px",availableUnits:[{unitType:"px"}]},"padding-bottom":{type:String,fieldType:"Number",propertyGroup:"padding",value:"20px",availableUnits:[{unitType:"px"}]},"padding-left":{type:String,fieldType:"Number",propertyGroup:"padding",value:"0px",availableUnits:[{unitType:"px"}]},"background-url":{type:String,fieldType:"Modal",propertyGroup:"background",value:"",assetType:"Image"},"background-position-x":{type:String,fieldType:"Number",propertyGroup:"background",value:"0%",availableUnits:[{unitType:"%"},{unitType:"left",noInputNumber:!0},{unitType:"center",noInputNumber:!0},{unitType:"right",noInputNumber:!0}]},"background-position-y":{type:String,fieldType:"Number",propertyGroup:"background",value:"0%",availableUnits:[{unitType:"%"},{unitType:"top",noInputNumber:!0},{unitType:"center",noInputNumber:!0},{unitType:"bottom",noInputNumber:!0}]},"background-repeat":{type:String,fieldType:"Select",propertyGroup:"background",value:"repeat",selectOptions:["no-repeat","repeat ","repeat-x","repeat-y"]},"background-size":{type:String,fieldType:"Number",propertyGroup:"background",value:"auto",availableUnits:[{unitType:"px"},{unitType:"%"},{unitType:"auto",noInputNumber:!0},{unitType:"cover",noInputNumber:!0},{unitType:"contain",noInputNumber:!0}]}}}static get options(){return{...super.options,componentName:"mj-section",componentUIName:"Row container",componentCategory:"container",componentDescription:"Group row container for editor",nestedComponents:["mj-column","mj-group"]}}update(e){super.update(e)}static get styles(){return[super.styles,i.iv`
         mj-section {
           padding: var(--padding-top) var(--padding-right) var(--padding-bottom) var(--padding-left);
        }
        :host {
          display: block;
          margin: 0 auto;
          width: var(--mj-body-width);
          min-height: 40px;
          border-radius: var(--border-radius);
          background-color: var(--background-color);
          direction: var(--direction);
          text-align: var(--text-align);
          vertical-align: var(--vertical-align);
        }
        .mj-section {
          margin: 0 auto;
          width: var(--mj-body-width);
          padding: var(--padding-top) var(--padding-right) var(--padding-bottom) var(--padding-left);
          box-sizing: border-box;
          background-position-x: var(--background-position-x);
          background-position-y: var(--background-position-y);
          background-repeat: var(--background-repeat);
          background-size: var(--background-size);
        }
        slot:not([name="mo-system"]) {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: center;
        }
      `]}get dynamicStyles(){const e=`url(${this["background-url"]})`;return i.dy`
      ${super.dynamicStyles}
      :host .mj-section {
        background-image: ${e};
      }
    `}render(){return i.dy`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class='mj-section'>
        <slot></slot>
      </div>
      ${this.constructor.systemSlotTemplate}
    `}}},7242:(e,t,r)=>{r.r(t),r.d(t,{MJWrapper:()=>u});var i=r(3712),o=r(520),n=r(3634),a=r(6283),p=r(8132),s=r(2089),d=r(7329);class u extends((0,n.applyMixins)(o.v,[n.EmailComponent,n.EmailComponentBaseClasses,n.ModeTrackable,a.FieldDefinition])){constructor(){super(),this.nodeInfoProps=[...this.nodeInfoProps,"is-layout"]}static get options(){return{...super.options,componentName:"mj-wrapper",componentUIName:"Layout container",componentCategory:"container",componentDescription:"Layout container to group rows for editor",nestedComponents:["mj-section"],isRootNested:!0}}static get properties(){return{...super.properties,"full-section-width":{type:Boolean,fieldType:"Boolean",propertyGroup:"layout",value:(0,d.a2)(),prop:!0},"background-color":{type:String,fieldType:"ColorPicker",propertyGroup:"background",value:"rgba(255, 255, 255, 0)"},"padding-top":{type:String,fieldType:"Number",propertyGroup:"padding",value:"0px",availableUnits:[{unitType:"px"}]},"padding-bottom":{type:String,fieldType:"Number",propertyGroup:"padding",value:"0px",availableUnits:[{unitType:"px"}]}}}updateFullSectionWidth(e){e.has("full-section-width")&&(this["full-section-width"]?this.setAttribute("full-width","full-width"):this.removeAttribute("full-width"))}update(e){super.update(e),this.updateFullSectionWidth(e)}static get styles(){return[super.styles,i.iv`
        :host {
          display: block;
          margin: 0 auto;
          width: var(--mj-body-width);
          min-height: 40px;
          background-color: var(--background-color);
        }
        .mj-wrapper {
          margin: 0 auto;
          padding: var(--padding-top) 0 var(--padding-bottom) 0;
          width: var(--mj-body-width);
          box-sizing: border-box;
        }
        slot:not([name="mo-system"]) {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: center;
        }
        :host([full-width]) {
          width: 100%;
        }
      `]}isElementsExist(e){return!![...this.querySelectorAll(e)].length}async elementCreationIfNeeded(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const{options:{componentName:r,defaultTemplate:i}}=e;this.isElementsExist(r)||await p.N.createElement(r,{},i,this,`#${this.id}`,t)}async firstUpdated(e){super.firstUpdated(e),await this.elementCreationIfNeeded(s.MJMLSection)}get dynamicStyles(){return i.dy`
      ${super.dynamicStyles}
    `}render(){return i.dy`
       <style>
        ${this.dynamicStyles}
       </style>
       <div class='mj-wrapper'>
         <slot></slot>
       </div>
       ${this.constructor.systemSlotTemplate}
    `}}}}]);