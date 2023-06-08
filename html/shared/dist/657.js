"use strict";(self.webpackChunkbasic_shared_resource=self.webpackChunkbasic_shared_resource||[]).push([[657],{7657:(e,t,i)=>{i.r(t),i.d(t,{MJMLText:()=>l});var r=i(3361),o=i(1762),n=i(705),a=i(3291),p=i(1452);class l extends((0,n.applyMixins)(o.v,[n.EmailComponent,n.ContentModule,n.EmailComponentBaseClasses,n.FontEmail,n.SafeFontFamilyCombination,n.ModeTrackable,a.FieldDefinition])){static get properties(){const{"should-shown":e,...t}=super.properties;return{color:{type:String,fieldType:"ColorPicker",propertyGroup:"text",value:"rgba(0, 0, 0, 1)"},...t,"should-shown":{...e,value:!0},"line-height":{type:String,fieldType:"Number",propertyGroup:"text",value:"22px",availableUnits:[{unitType:"px"}]},"letter-spacing":{type:String,fieldType:"Number",propertyGroup:"text",value:"0px",availableUnits:[{unitType:"px"}]},"text-decoration":{type:String,fieldType:"RadioGroup",propertyGroup:"text",value:"none",selectOptions:[{value:"none",icon:"x-small"},{value:"underline",icon:"underline"},{value:"line-through",icon:"strikethrough"},{value:"overline",icon:"overline"}]},"text-transform":{type:String,fieldType:"RadioGroup",propertyGroup:"text",value:"none",selectOptions:[{value:"none",icon:"x-small"},{value:"uppercase",icon:"uppercase"},{value:"capitalize",icon:"titlecase"},{value:"lowercase",icon:"lowercase"}]},align:{type:String,fieldType:"RadioGroup",propertyGroup:"text",value:"left",selectOptions:[{value:"left",icon:"textalign"},{value:"center",icon:"textalignmid"},{value:"right",icon:"textalignright"},{value:"justify",icon:"burger"}]},"container-background-color":{type:String,fieldType:"ColorPicker",propertyGroup:"background",value:"rgba(255, 255, 255, 0)"},"padding-top":{type:String,fieldType:"Number",propertyGroup:"padding",value:"10px",availableUnits:[{unitType:"px"}]},"padding-right":{type:String,fieldType:"Number",propertyGroup:"padding",value:"10px",availableUnits:[{unitType:"px"}]},"padding-bottom":{type:String,fieldType:"Number",propertyGroup:"padding",value:"10px",availableUnits:[{unitType:"px"}]},"padding-left":{type:String,fieldType:"Number",propertyGroup:"padding",value:"10px",availableUnits:[{unitType:"px"}]},direction:{type:String,fieldType:"RadioGroup",propertyGroup:"text",value:"",selectOptions:[{value:"ltr",icon:"textdirectionltr"},{value:"rtl",icon:"textdirectionrtl"}]}}}static get options(){return{...super.options,componentName:"mj-text",componentContentType:"text",componentUIName:"Text for email",componentDescription:"Email text element",isTextEdit:!0,nestedComponents:[],defaultTemplate:"<p>Enter your text here</p>"}}static getTextDirection(e){return"rtl"===e?"right":"left"}updateTextDirection(e){if(this.isRendered&&e.has("direction")){const t=this["css-class"],i=l.getTextDirection(this.direction),r=`act-text-direction-${i}`,o=`act-text-direction-${l.getTextDirection(e.get("direction"))}`,n=[...t.split(" ").filter((e=>e!==o)),r].join(" ");p.N.updateAttributeList({attrList:[{attrKey:"css-class",attrValue:n},{attrKey:"align",attrValue:i}],isComponent:!0,selectorId:this.id})}}updated(e){super.updated(e),this.updateTextDirection(e)}static get styles(){return[super.styles,r.iv`
         :host {
          display: block;
          width: 100%;
          min-height: 1em;
          color: var(--color);
          letter-spacing: var(--letter-spacing);
          word-break: break-word;
          line-height: var(--line-height);
          text-decoration: var(--text-decoration);
          text-transform: var(--text-transform);
          text-align: var(--align);
          font-size: var(--font-size);
          background-color: var(--container-background-color);
          direction: var(--direction);
        }
        :host .mj-text-wrapper {
          padding: var(--padding-top) var(--padding-right) var(--padding-bottom) var(--padding-left);
        }
        ::slotted(*) {
          text-transform: var(--text-transform);
          text-decoration: var(--text-decoration);
          line-height: var(--line-height);
        }
        :host(.${(0,r.$m)(n.ModeTrackable.NoteModeClassName)}) ::slotted(p) {
          pointer-events: none;
        }
      `]}setContentModule(e){this.innerHTML=e}render(){return r.dy`
      <style>
        ${super.dynamicStyles}
      </style>
      <div class='mj-text-wrapper'>
        <slot></slot>
      </div>
      ${this.constructor.systemSlotTemplate}
    `}}}}]);