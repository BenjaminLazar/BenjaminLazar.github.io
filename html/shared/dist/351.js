"use strict";(self.webpackChunkbasic_shared_resource=self.webpackChunkbasic_shared_resource||[]).push([[351],{9351:(e,t,o)=>{o.r(t),o.d(t,{DocumentFooter:()=>p});var s=o(3712),i=o(520),r=o(3634),n=o(6283);class p extends((0,r.applyMixins)(i.v,[r.SlideComponentBase,n.Container,n.Display,n.Dimensions])){static get properties(){const{top:e,left:t,width:o,height:s,opacity:i}=super.properties;return{top:{...e,value:"675px"},left:{...t,value:"96px"},width:{...o,value:"655px"},height:{...s,value:"75px"},opacity:i}}static get options(){return{...super.options,componentName:"document-footer",componentUIName:"Document Footer",componentCategory:"custom",componentScope:"custom",componentDescription:"Custom footer for slide",componentDomain:"slide",defaultTemplate:"<p>Please! Add text for your footer here!</p>",isTextEdit:!0}}static get styles(){return[super.styles,s.iv`
        :host {
          position: absolute;
          width: var(--width);
          height: var(--height);
          font-size: 9px;
          font-weight: 500;
        }
        :host * {
          margin:0;
          padding:0;
        }
       `]}render(){return super.render(),s.dy`
      <style>
        ${this.dynamicStyles}
      </style>
      <div class='content'>
        <slot></slot>
      </div>
      ${this.constructor.systemSlotTemplate}
    `}}}}]);