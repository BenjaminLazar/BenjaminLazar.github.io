"use strict";(self.webpackChunkbasic_shared_resource=self.webpackChunkbasic_shared_resource||[]).push([[987,58],{3058:(t,r,e)=>{e.r(r),e.d(r,{FusionArrowPopupOverlay:()=>s});var o=e(3361),n=e(5959);class s extends n.FusionCustomPopupOverlay{static get options(){return{...super.options,componentName:"fusion-arrow-popup-overlay",componentUIName:"Arrow Overlay",componentDescription:"Popup with selectable placement of pointing arrow"}}static get properties(){const{position:t,color:r,"font-weight":e,"font-style":o,...n}=super.properties;return{...n,"arrow-width":{type:String,fieldType:"Number",propertyGroup:"arrowPopup",value:"40px",availableUnits:[{unitType:"px"}]},"arrow-height":{type:String,fieldType:"Number",propertyGroup:"arrowPopup",value:"40px",availableUnits:[{unitType:"px"}]},"arrow-position":{type:String,fieldType:"Select",propertyGroup:"arrowPopup",value:"left-top",selectOptions:["top-left","top-center","top-right","left-top","left-center","left-bottom","right-top","right-center","right-bottom","bottom-left","bottom-center","bottom-right"]}}}getArrowPosition(){const[t,r]=this["arrow-position"].split("-"),e=this.constructor.getOppositePosition,o=e(t),n=e(r);return{originOne:t.toLowerCase(),originTwo:r.toLowerCase(),oppositeOne:o,oppositeTwo:n}}static getOppositePosition(t){return{left:"right",right:"left",top:"bottom",bottom:"top"}[t]}getCorneredArrowStyle(){const{originTwo:t,oppositeOne:r,oppositeTwo:e}=this.getArrowPosition(),o=this.constructor.getBorderSideStyle();return`\n      :host [part='overlay']:before {\n        ${r}: calc(100% - var(--border-width));\n        ${t}: var(--border-radius);\n        border-${t}: ${o};\n        border-${e}: ${o};\n        border-${r}: var(--arrow-width) solid var(--border-color);\n      }\n    `}getCenteredArrowStyle(){const{oppositeOne:t}=this.getArrowPosition(),r=this.constructor.getBorderSideStyle();return`\n      :host [part='overlay']:before {\n        ${t}: calc(100% - var(--border-width));\n        border-${t}: var(--arrow-width) solid var(--border-color);\n      }\n      :host .top-center:before,\n      :host .bottom-center:before {\n        left: 50%;\n        transform: translateX(-50%);\n        border-left: ${r};\n        border-right: ${r};\n      }\n      :host .left-center:before,\n      :host .right-center:before {\n        top: 50%;\n        transform: translateY(-50%);\n        border-top: ${r};\n        border-bottom: ${r};\n      }\n    `}static getBorderSideStyle(){return"calc(var(--arrow-height) / 2) solid rgba(255, 255, 255, 0)"}getArrowStyle(){return this["arrow-position"].includes("center")?this.getCenteredArrowStyle():this.getCorneredArrowStyle()}updateArrowStyleByBorderWidth(){if(this.constructor.isBorderEmpty(...this.getBorderProps(.02))){const{oppositeOne:t}=this.getArrowPosition();return`\n        :host [part='overlay']:before {\n          ${t}: 100%;\n          border-${t}-color: var(--background-color);\n        }`}return""}static get styles(){return[super.styles,o.iv`
        [part="overlay"]:before {
          content: "";
          position: absolute;
          border: solid transparent;
          pointer-events: none;
        }
      `]}get dynamicStyles(){return o.dy`
      ${super.dynamicStyles}
      ${this.getArrowStyle()}
      ${this.updateArrowStyleByBorderWidth()}
    `}render(){return o.dy`
      <style>
        ${this.dynamicStyles}
      </style>
      <div part='overlay' class=${this["arrow-position"]}><slot></slot></div>
      ${this.constructor.systemSlotTemplate}
    `}}},1987:(t,r,e)=>{e.r(r),e.d(r,{FusionArrowPopup:()=>a});var o=e(3361),n=e(9685),s=e(7475),i=e(3058);const p="ArrowPopup";class a extends n.FusionPopup{static get options(){return{...super.options,componentName:"fusion-arrow-popup",componentUIName:"Arrow Popup",componentDescription:"Popup with selectable placement of pointing arrow",nestedComponents:["fusion-backdrop","fusion-arrow-popup-overlay"]}}static get state(){return p}constructor(){super(),this.state=p,this.overlay=(0,s.Tl)(i.FusionArrowPopupOverlay)}static get styles(){return[super.styles,o.iv`
        [part='overlay'] {
          padding: 30px 40px;
          background-clip: padding-box; 
        }
        [part="overlay"]:before {
          content: "";
          position: absolute;
          border: solid transparent;
          pointer-events: none;
        }
       `]}render(){return o.dy`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class='popup-content-wrapper'>
        <slot></slot>
      </div>
      ${this.constructor.systemSlotTemplate}
    `}}}}]);