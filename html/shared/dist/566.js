"use strict";(self.webpackChunkbasic_shared_resource=self.webpackChunkbasic_shared_resource||[]).push([[566],{566:(t,i,e)=>{e.r(i),e.d(i,{FusionNotification:()=>r});var n=e(3361),o=(e(4814),e(1762)),s=e(7475),a=e(705);class r extends((0,a.applyMixins)(o.v,[a.SlideComponentBase,a.Stateful])){static get properties(){return{"state-id":{type:String,fieldType:"String",propertyGroup:"notification"},opened:{type:Boolean,fieldType:"Boolean",propertyGroup:"notification",value:!1},position:{type:String,fieldType:"String",propertyGroup:"notification",value:"bottom-start"},duration:{type:String,fieldType:"Number",propertyGroup:"notification",value:"4000"},level:{type:String,fieldType:"Number",propertyGroup:"notification",value:"0",unit:""}}}static get options(){return{...super.options,componentName:"fusion-notification",componentUIName:"Notification",componentType:"system",componentDescription:"Temporary notification sliding in from edge of content",isRootNested:!1,nestedComponents:[],baseLevel:1e3}}firstUpdated(t){super.firstUpdated(t);const i=document.createElement("template");i.innerHTML=`${this.innerHTML}`,this.notification=this.shadowRoot.querySelector("vaadin-notification"),this.notification.appendChild(i),this.notification.addEventListener("opened-changed",this.changeNotification.bind(this)),this.notification.setAttribute("duration",this.duration),this.notification.setAttribute("position",this.position)}changeNotification(t){!t.detail.value&&this.inactivate()}enter(){this.notification.open(),this.addLevel()}exit(){const t=(0,s.RL)(this.duration).num;this.notification.close(),this.removeLevel(t)}static get styles(){return[super.styles,n.iv`
       :host([hidden]),
        :host(:not([opened]):not([closing])) {
          display: none !important;
        }
        [part="notification"] {
          z-index: var(--level);
        }
      `]}render(){return super.render(),n.dy`
      <style>
        ${this.dynamicStyles}
      </style>
      <vaadin-notification part="notification"></vaadin-notification>
      <slot></slot>
      ${this.constructor.systemSlotTemplate}
    `}}}}]);