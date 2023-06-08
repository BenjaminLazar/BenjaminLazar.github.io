"use strict";(self.webpackChunkbasic_shared_resource=self.webpackChunkbasic_shared_resource||[]).push([[75],{6075:(e,t,a)=>{a.r(t),a.d(t,{FusionChartData:()=>p});var r=a(3712),o=a(520),s=a(8132),n=a(3634);class p extends((0,n.applyMixins)(o.v,[n.ModeTrackable,n.SlideComponentBase])){static get properties(){return{legend:{type:String,fieldType:"String",propertyGroup:"chartData",value:"Placebo",prop:!0},values:{type:String,fieldType:"String",propertyGroup:"chartData",value:"0.085,0.18,0.145,0.2,0.23,0.22,0.21,0.2,0.2,0.185",prop:!0},type:{type:String,fieldType:"Select",propertyGroup:"chartData",value:"bar",prop:!0,selectOptions:["area","area-spline","area-step","bar","donut","gauge","line","pie","scatter","spline","step"]},"chart-color":{type:String,fieldType:"ColorPicker",propertyGroup:"chartData",value:"rgba(0, 86, 250, 1)"},groups:{type:Boolean,fieldType:"Boolean",propertyGroup:"chartData",value:!1,prop:!0}}}static get options(){return{...super.options,componentName:"fusion-chart-data",componentUIName:"Chart Data",componentCategory:"data",componentDescription:"Provides chart component with configurable data values",isRootNested:!1,nestedComponents:[],resizable:!1,draggable:!1,rotatable:!1}}connectedCallback(){super.connectedCallback(),this.connectedActions()}connectedActions(){this.hasAttribute("chart-data-id")||this.setAttribute("chart-data-id",s.N.generateId())}disconnectedCallback(){super.disconnectedCallback(),this.emitCustomEvent("remove")}update(e){super.update(e),this.emitCustomEvent("update")}static get styles(){return[super.styles,r.iv`
        :host(.${(0,r.$m)(n.ModeTrackable.EditModeClassName)}) {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 30px;
          z-index: 2;
        }
        :host(.${(0,r.$m)(n.ModeTrackable.EditModeClassName)}):before {
          content: '';
          position: absolute;
          width: 30px;
          height: 100%;
          left: 50%;
          background: var(--chart-color);
          transform: translateX(-50%);
        }
      `]}render(){return super.render(),r.dy`
      <style>
        ${this.dynamicStyles}
      </style>
      ${this.constructor.systemSlotTemplate}
    `}}}}]);