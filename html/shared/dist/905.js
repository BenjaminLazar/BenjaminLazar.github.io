"use strict";(self.webpackChunkbasic_shared_resource=self.webpackChunkbasic_shared_resource||[]).push([[905],{5905:(e,t,i)=>{i.r(t),i.d(t,{MJMLButton:()=>l});var n=i(3712),r=i(520),o=i(3634),a=i(6283),p=i(4045);class l extends((0,o.applyMixins)(r.v,[o.ModeTrackable,o.LinkExtension,o.EmailComponent,o.ContentModule,o.EmailComponentBaseClasses,o.FontEmail,o.SafeFontFamilyCombination,o.EmailBorder,a.FieldDefinition])){static get properties(){const{"should-shown":e,...t}=super.properties;return{width:{type:String,fieldType:"Number",propertyGroup:"size",value:"100%",availableUnits:[{unitType:"px"},{unitType:"%"}]},height:{type:String,fieldType:"Number",propertyGroup:"size",value:"35px",availableUnits:[{unitType:"px"}]},"padding-top":{type:String,fieldType:"Number",propertyGroup:"padding",value:"10px",availableUnits:[{unitType:"px"}]},"padding-right":{type:String,fieldType:"Number",propertyGroup:"padding",value:"25px",availableUnits:[{unitType:"px"}]},"padding-bottom":{type:String,fieldType:"Number",propertyGroup:"padding",value:"10px",availableUnits:[{unitType:"px"}]},"padding-left":{type:String,fieldType:"Number",propertyGroup:"padding",value:"25px",availableUnits:[{unitType:"px"}]},"inner-padding-top":{type:String,fieldType:"Number",propertyGroup:"innerPadding",value:"5px",availableUnits:[{unitType:"px"}]},"inner-padding-right":{type:String,fieldType:"Number",propertyGroup:"innerPadding",value:"25px",availableUnits:[{unitType:"px"}]},"inner-padding-bottom":{type:String,fieldType:"Number",propertyGroup:"innerPadding",value:"5px",availableUnits:[{unitType:"px"}]},"inner-padding-left":{type:String,fieldType:"Number",propertyGroup:"innerPadding",value:"25px",availableUnits:[{unitType:"px"}]},"border-radius":{type:String,fieldType:"Number",propertyGroup:"border",value:"3px",availableUnits:[{unitType:"px"},{unitType:"%"}]},"background-color":{type:String,fieldType:"ColorPicker",propertyGroup:"background",value:"rgba(65, 65, 65, 1)"},color:{type:String,fieldType:"ColorPicker",propertyGroup:"text",value:"rgba(255, 255, 255, 1)"},align:{type:String,fieldType:"RadioGroup",propertyGroup:"layout",value:"center",selectOptions:[{value:"left",icon:"start-vertical"},{value:"center",icon:"center-vertical"},{value:"right",icon:"end-vertical"}]},"text-align":{type:String,fieldType:"RadioGroup",propertyGroup:"text",value:"center",selectOptions:[{value:"left",icon:"textalign"},{value:"center",icon:"textalignmid"},{value:"right",icon:"textalignright"}]},"vertical-align":{type:String,fieldType:"RadioGroup",propertyGroup:"text",value:"middle",selectOptions:[{value:"top",icon:"textaligntop"},{value:"middle",icon:"textaligncenter"},{value:"bottom",icon:"textalignbottom"}]},"line-height":{type:String,fieldType:"Number",propertyGroup:"text",value:"120%"},...t,"should-shown":{...e,value:!0},"text-transform":{type:String,fieldType:"RadioGroup",propertyGroup:"text",value:"none",selectOptions:[{value:"none",icon:"x-small"},{value:"uppercase",icon:"uppercase"},{value:"capitalize",icon:"titlecase"},{value:"lowercase",icon:"lowercase"}]},"text-decoration":{type:String,fieldType:"RadioGroup",propertyGroup:"text",value:"none",selectOptions:[{value:"none",icon:"x-small"},{value:"underline",icon:"underline"},{value:"overline",icon:"overline"}]}}}static get options(){return{...super.options,componentName:"mj-button",componentContentType:"text",componentUIName:"Button",componentDescription:"Basic button for adding interactions",isTextEdit:!0,nestedComponents:[],defaultTemplate:"Button",alignConfig:{top:"flex-start",left:"flex-start",center:"center",middle:"center",right:"flex-end",bottom:"flex-end"},quillBlockAttrList:{"ql-content":""}}}getInnerPadding(){return`${this["inner-padding-top"]} ${this["inner-padding-right"]} ${this["inner-padding-bottom"]} ${this["inner-padding-left"]}`}setInnerPadding(){const e=this.getInnerPadding();this.setAttribute("inner-padding",e)}setContentModule(e){this.innerHTML=e}static get styles(){return[super.styles,n.iv`
        :host {
          width: 100%;
          height: auto;
          display: block;
        }
        :host .mj-button-wrapper{
          padding: var(--padding-top) var(--padding-right) var(--padding-bottom) var(--padding-left);
        }
        :host .mj-button {
          display: flex;
          box-sizing: border-box;
        }
        :host .mj-button-container {
          display: flex;
          width: var(--width);
          min-height: var(--height);
          padding: var(--inner-padding-top) var(--inner-padding-right) var(--inner-padding-bottom) var(--inner-padding-left);
          font-size: var(--font-size);
          font-style: var(--font-style);
          font-weight: var(--font-weight);
          line-height: var(--line-height);
          text-decoration: var(--text-decoration);
          text-transform: var(--text-transform);
          border-radius: var(--border-radius);
          color: var(--color);
          background-color: var(--background-color);
          box-sizing: border-box;
          word-break: break-word;
          cursor: pointer;
        }
        :host slot[name="mo-system"] .main {
          position: absolute;
          top: 0;
        }
      `]}get dynamicStyles(){const{alignConfig:e}=this.constructor.options;return n.dy`
      ${super.dynamicStyles}
      :host .mj-button {
        justify-content: ${e[this.align]};
      }
      :host .mj-button-container {
        justify-content: ${e[this["text-align"]]};
        align-items: ${e[this["vertical-align"]]};
        ${p.l.getBorderStyles(this)}
      }
      :host .mj-button-text {
        text-align: ${this["text-align"]};
      }
      :host(.${(0,n.$m)(o.ModeTrackable.EditModeClassName)}) .mj-button-container {
          cursor: inherit;
      }
      :host(.${(0,n.$m)(o.ModeTrackable.NoteModeClassName)}) .mj-button-container {
        pointer-events: none;
      }
    `}render(){return this.setInnerPadding(),n.dy`
      <style>
      ${this.dynamicStyles}
      </style>
      <div class='mj-button-wrapper'>
        <div class='mj-button'>
          <div class='mj-button-container' @click='${()=>this.openLink()}'>
            <div class='mj-button-text'><slot></slot></div>
          </div>
        </div>
      </div>
      ${this.constructor.systemSlotTemplate}
    `}}}}]);