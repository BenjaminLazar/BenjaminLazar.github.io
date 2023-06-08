"use strict";(self.webpackChunkbasic_shared_resource=self.webpackChunkbasic_shared_resource||[]).push([[89],{2089:(e,t,r)=>{r.r(t),r.d(t,{MJMLSection:()=>a});var n=r(3712),i=r(520),p=r(3634),o=r(6283);class a extends((0,p.applyMixins)(i.v,[p.ModeTrackable,p.EmailComponent,p.EmailComponentBaseClasses,o.FieldDefinition])){static get properties(){return{...super.properties,"border-radius":{type:String,fieldType:"Number",propertyGroup:"border",value:"0px",availableUnits:[{unitType:"px"},{unitType:"%"}]},"background-color":{type:String,fieldType:"ColorPicker",propertyGroup:"background",value:"rgba(255, 255, 255, 0)"},"padding-top":{type:String,fieldType:"Number",propertyGroup:"padding",value:"20px",availableUnits:[{unitType:"px"}]},"padding-right":{type:String,fieldType:"Number",propertyGroup:"padding",value:"0px",availableUnits:[{unitType:"px"}]},"padding-bottom":{type:String,fieldType:"Number",propertyGroup:"padding",value:"20px",availableUnits:[{unitType:"px"}]},"padding-left":{type:String,fieldType:"Number",propertyGroup:"padding",value:"0px",availableUnits:[{unitType:"px"}]},"background-url":{type:String,fieldType:"Modal",propertyGroup:"background",value:"",assetType:"Image"},"background-position-x":{type:String,fieldType:"Number",propertyGroup:"background",value:"0%",availableUnits:[{unitType:"%"},{unitType:"left",noInputNumber:!0},{unitType:"center",noInputNumber:!0},{unitType:"right",noInputNumber:!0}]},"background-position-y":{type:String,fieldType:"Number",propertyGroup:"background",value:"0%",availableUnits:[{unitType:"%"},{unitType:"top",noInputNumber:!0},{unitType:"center",noInputNumber:!0},{unitType:"bottom",noInputNumber:!0}]},"background-repeat":{type:String,fieldType:"Select",propertyGroup:"background",value:"repeat",selectOptions:["no-repeat","repeat ","repeat-x","repeat-y"]},"background-size":{type:String,fieldType:"Number",propertyGroup:"background",value:"auto",availableUnits:[{unitType:"px"},{unitType:"%"},{unitType:"auto",noInputNumber:!0},{unitType:"cover",noInputNumber:!0},{unitType:"contain",noInputNumber:!0}]}}}static get options(){return{...super.options,componentName:"mj-section",componentUIName:"Row container",componentCategory:"container",componentDescription:"Group row container for editor",nestedComponents:["mj-column","mj-group"]}}update(e){super.update(e)}static get styles(){return[super.styles,n.iv`
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
      `]}get dynamicStyles(){const e=`url(${this["background-url"]})`;return n.dy`
      ${super.dynamicStyles}
      :host .mj-section {
        background-image: ${e};
      }
    `}render(){return n.dy`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class='mj-section'>
        <slot></slot>
      </div>
      ${this.constructor.systemSlotTemplate}
    `}}}}]);