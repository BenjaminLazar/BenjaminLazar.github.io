"use strict";(self.webpackChunkbasic_shared_resource=self.webpackChunkbasic_shared_resource||[]).push([[769],{8769:(e,r,i)=>{i.r(r),i.d(r,{MJMLDivider:()=>a});var t=i(3712),p=i(520),o=i(3634),d=i(6283);class a extends((0,o.applyMixins)(p.v,[o.EmailComponent,d.FieldDefinition,o.EmailComponentBaseClasses])){static get properties(){return{width:{type:String,fieldType:"Number",propertyGroup:"size",value:"100%",availableUnits:[{unitType:"px"},{unitType:"%"}]},"border-color":{type:String,fieldType:"ColorPicker",propertyGroup:"line",value:"rgba(0, 0, 0, 1)"},"border-style":{type:String,fieldType:"RadioGroup",propertyGroup:"line",value:"solid",selectOptions:[{value:"solid",icon:"zoomminus"},{value:"dotted",icon:"dotted"},{value:"dashed",icon:"dashed"}]},"border-width":{type:String,fieldType:"Number",propertyGroup:"line",value:"4px",availableUnits:[{unitType:"px"}]},"container-background-color":{type:String,fieldType:"ColorPicker",propertyGroup:"background",value:"rgba(255, 255, 255, 0)"},"padding-top":{type:String,fieldType:"Number",propertyGroup:"padding",value:"10px",availableUnits:[{unitType:"px"}]},"padding-right":{type:String,fieldType:"Number",propertyGroup:"padding",value:"25px",availableUnits:[{unitType:"px"}]},"padding-bottom":{type:String,fieldType:"Number",propertyGroup:"padding",value:"10px",availableUnits:[{unitType:"px"}]},"padding-left":{type:String,fieldType:"Number",propertyGroup:"padding",value:"25px",availableUnits:[{unitType:"px"}]},...super.properties}}firstUpdated(e){super.firstUpdated(e)}static get options(){return{...super.options,componentName:"mj-divider",componentUIName:"Divider",componentDescription:"Email components divider",componentDomain:"email",nestedComponents:[]}}static get styles(){return[super.styles,t.iv`
        :host {
          width: var(--width);
          margin: 0 auto;
          display: block;
          background: var(--container-background-color);
        }
        :host .mj-divider-wrapper {
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          padding: var(--padding-top) var(--padding-right) var(--padding-bottom) var(--padding-left);
        }
        :host .mj-divider {
          width: 100%;
          border-top: var(--border-width) var(--border-style) var(--border-color);
          box-sizing: border-box;
        }
      `]}render(){return t.dy`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class='mj-divider-wrapper'>
        <div class='mj-divider'></div>
      </div>
      ${this.constructor.systemSlotTemplate}
    `}}}}]);