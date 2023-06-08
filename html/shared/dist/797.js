(self.webpackChunkbasic_shared_resource=self.webpackChunkbasic_shared_resource||[]).push([[797],{4797:(t,e,r)=>{"use strict";r.r(e),r.d(e,{FusionChart:()=>g});var i=r(3361),a=r(7732),o=r(6797),s=r(1762),n=r(7475),p=r(1452),l=r(705),c=r(3291);const h=r(8247),d=r(7444),u={...(0,n.br)(h),...(0,n.br)(d)};class g extends((0,l.applyMixins)(s.v,[l.SlideComponentBase,c.Typography,c.Container,c.Dimensions,c.FieldDefinition])){static get properties(){const{position:t,top:e,left:r,width:i,height:a,"font-family":o,"font-weight":s}=super.properties,n=Object.keys(u);return{position:t,top:e,left:r,width:{...i,value:"800px",min:"400",availableUnits:[]},height:{...a,value:"400px",min:"200",availableUnits:[]},locale:{type:String,fieldType:"Select",propertyGroup:"chart",value:"en-GB",selectOptions:n},"font-family":o,"show-labels":{type:Boolean,fieldType:"Boolean",propertyGroup:"chart",value:!1,prop:!0},"labels-position":{type:String,fieldType:"Select",propertyGroup:"chart",value:"outer",prop:!0,selectOptions:["outer","inner"]},"labels-inner-indent":{type:String,fieldType:"Number",propertyGroup:"chart",value:"0px"},"labels-font-size":{type:String,fieldType:"Number",propertyGroup:"chart",value:"10px"},"labels-font-weight":{...s,propertyGroup:"chart"},"labels-color":{type:String,fieldType:"ColorPicker",propertyGroup:"chart",value:"rgba(0, 0, 0, 1)"},"show-legend":{type:Boolean,fieldType:"Boolean",propertyGroup:"chart",value:!0,prop:!0},"legend-position":{type:String,fieldType:"Select",propertyGroup:"chart",value:"inset",prop:!0,selectOptions:["bottom","right","inset"]},"show-tooltip":{type:Boolean,fieldType:"Boolean",propertyGroup:"chart",value:!0,prop:!0},"grouped-tooltip":{type:Boolean,fieldType:"Boolean",propertyGroup:"chart",value:!0,prop:!0},"x-axis-type":{type:String,fieldType:"Select",value:"category",propertyGroup:"chart",prop:!0,selectOptions:["category","indexed"]},"x-axis-tick-rotate":{type:String,fieldType:"Number",propertyGroup:"chart",value:"0px",prop:!0},"x-axis-tick-height":{type:String,fieldType:"Number",propertyGroup:"chart",value:"0px",prop:!0},"x-axis-font-size":{type:String,fieldType:"Number",propertyGroup:"chart",value:"10px"},"x-axis-font-weight":{...s,propertyGroup:"chart"},"x-axis-label-text":{type:String,fieldType:"String",propertyGroup:"chart",value:"",prop:!0},"x-axis-label-position":{type:String,fieldType:"Select",propertyGroup:"chart",value:"outer-center",prop:!0,selectOptions:["inner-right","inner-center","inner-left","outer-right","outer-center","outer-left"]},"x-axis-label-font-size":{type:String,fieldType:"Number",propertyGroup:"chart",value:"10px"},"x-axis-label-font-weight":{fontWeight:s,propertyGroup:"chart"},"x-axis-label-color":{type:String,fieldType:"ColorPicker",propertyGroup:"chart",value:"rgba(0, 0, 0, 1)"},"y-axis-font-size":{type:String,fieldType:"Number",propertyGroup:"chart",value:"10px"},"y-axis-font-weight":{...s,propertyGroup:"chart"},"y-axis-label-text":{type:String,fieldType:"String",propertyGroup:"chart",value:"",prop:!0},"y-axis-label-position":{type:String,fieldType:"Select",propertyGroup:"chart",value:"outer-middle",prop:!0,selectOptions:["inner-top","inner-middle","inner-bottom","outer-top","outer-middle","outer-bottom"]},"y-axis-label-font-size":{type:String,fieldType:"Number",propertyGroup:"chart",value:"10px"},"y-axis-label-font-weight":{...s,propertyGroup:"chart"},"y-axis-label-color":{type:String,fieldType:"ColorPicker",propertyGroup:"chart",value:"rgba(0, 0, 0, 1)"},"axis-rotate":{type:Boolean,fieldType:"Boolean",propertyGroup:"chart",value:!1,prop:!0},"show-grid":{type:Boolean,fieldType:"Boolean",propertyGroup:"chart",value:!1,prop:!0},"show-line-point":{type:Boolean,fieldType:"Boolean",propertyGroup:"chart",value:!1,prop:!0}}}static get options(){return{...super.options,componentName:"fusion-chart",componentUIName:"Chart",componentCategory:"data",componentDescription:"Fully configurable chart accepting any number of data series",nestedComponents:["fusion-chart-data"]}}constructor(){super(),this.series=[],this.drawChartBinded=this.drawChart.bind(this),this.updaterBinded=this.updateData.bind(this),this.removerBinded=this.removeData.bind(this),this.propsChange(this.setStaticPropsValues)}setStaticPropsValues(t,e){e.prop&&(this[t]=this.getAttribute(t))}disconnectedCallback(){this.chart.destroy(),this.shadowRoot.querySelector("slot:not([name])").removeEventListener("slotchange",this.drawChartBinded),this.querySelectorAll("fusion-chart-data").forEach((t=>t.removeEventListener("update",this.updaterBinded))),this.querySelectorAll("fusion-chart-data").forEach((t=>t.removeEventListener("remove",this.removerBinded))),this.chart.element.remove(),super.disconnectedCallback()}revertAxis(){const t=this.chartOptions.axis.x.label.position;this.chartOptions.axis.x.label.position=this.chartOptions.axis.y.label.position,this.chartOptions.axis.y.label.position=t}updateProps(){const t=this.getPropsOptions();this.chartOptions=(0,n.WA)(this.chartOptions,t),this.chartOptions.axis.rotated&&this.revertAxis(),(0,n.Ds)(this.generateChart())}update(t){if(super.update(t),t.has("locale")){const t=",";(0,o.ZP)(u[this.locale]),this.localeFormat=(0,o.WU)(t)}this.chartOptions&&this.updateProps()}checkSizes(t){const e=(0,n.In)(t,this.constructor.sizeTriggers);Array.from(e.keys()).forEach((t=>{const{num:e,unit:r}=(0,n.RL)(this[t]),i=Math.max(e,this.constructor.properties[t].min);this.setElementProp(t,`${i}${r}`),this.setAttribute(t,`${i}${r}`)})),this.chartResize()}chartResize(){this.chart&&(this.chart.resize(),this.chart.internal.selectChart.style("max-height","none"))}static changeChartDataId(t){const e=p.N.generateId();return t.setAttribute("chart-data-id",e),p.N.saveAttributes(`#${t.id}`,{"chart-data-id":e},!0),e}static checkChartDataIdDuplication(t){return t.reduce(((t,e)=>{let r=e.getAttribute("chart-data-id");return t.includes(r)&&(r=this.changeChartDataId(e)),t.push(r),t}),[]),t}getChartDataList(){const t=[...this.querySelectorAll("fusion-chart-data")];return this.constructor.checkChartDataIdDuplication(t)}getSeriesIdList(){return this.series.map((t=>t.id))}drawChart(){this.chartDataList=this.mutateChartData(),this.drawChartData()}mutateChartData(){const t=this.getSeriesIdList(),e=this.getChartDataList();return e.length>t.length&&this.addItemToSerie([...e],t),e}addItemToSerie(t,e){const r=t.shift();r&&!e.includes(r.getAttribute("chart-data-id"))&&(r.addEventListener("update",this.updaterBinded),r.addEventListener("remove",this.removerBinded),this.series.push(this.constructor.createSerie(r))),t.length>0&&this.addItemToSerie(t,e)}updateData(t){let{target:e}=t;const r=this.getIndex(e.getAttribute("chart-data-id")),i=this.constructor.createSerie(this.chartDataList[r]);this.series.splice(r,1,i),this.drawChartData()}async removeData(t){let{target:e}=t;const r=this.getIndex(e.getAttribute("chart-data-id"));this.series.splice(r,1),e.removeEventListener("update",this.updaterBinded),e.removeEventListener("remove",this.removerBinded),await this.updateComplete,this.generateChart()}getIndex(t){return this.series.findIndex((e=>e.id===t))}static createSerie(t){const e=t.getAttribute("chart-data-id"),r=t.hasAttribute("legend")?t.getAttribute("legend"):e,i=t.hasAttribute("values")?t.getAttribute("values").split(",").map((t=>Number(t))):[];return{id:e,legend:r,color:t.getAttribute("chart-color"),values:i,type:t.getAttribute("type"),groups:t.getAttribute("groups")||!1}}drawChartData(){const{columns:t,colors:e,types:r,names:i,groups:a}=this.gatheringData();this.chartOptions.data={...this.chartOptions.data,columns:t,colors:e,types:r,names:i,groups:a},this.updateChart(this.chartOptions.data)}gatheringData(){const t={types:{},colors:{},names:{}},e=[],r=this.series.map((r=>(this.constructor.groupingData(r,e),t.types=this.constructor.dataAssign(t.types,r,"type"),t.colors=this.constructor.dataAssign(t.colors,r,"color"),t.names=this.constructor.dataAssign(t.names,r,"legend"),[r.id,...r.values])));return{...t,columns:r,groups:[e]}}updateChart(t){this.chart.unload({done:()=>{this.chart.load(t),this.chart.groups(t.groups)}})}static groupingData(t,e){t.groups&&e.push(t.id)}static dataAssign(t,e,r){return{...t,[e.id]:e[r]}}initChartOptions(){const t=this.getGraphOptions(),e=this.getPropsOptions();return(0,n.WA)(e,t)}getGraphOptions(){const{shadowRoot:t,updateLabelsByPosition:e,id:r}=this,i=e.bind(this);return{bindto:t.getElementById("chart"),data:{columns:[],groups:[]},onresized(){this.selectChart.style("max-height","none")},onrendered(){const t=this.main.selectAll(`.${this.CLASS.texts} .${this.CLASS.text}`);t.data().length&&(t.classed(`custom-labels-${r}`,!0),i())}}}getPropsOptions(){return{size:{height:(0,n.RL)(this.height).num,width:(0,n.RL)(this.width).num},data:{labels:{format:this.localeFormat}},legend:{show:this["show-legend"],position:this["legend-position"]},tooltip:{show:this["show-tooltip"],grouped:this["grouped-tooltip"],order:"desc",format:this.localeFormat},axis:{rotated:this["axis-rotate"],x:{label:{text:this["x-axis-label-text"],position:this["x-axis-label-position"]},type:this["x-axis-type"],tick:{rotate:(0,n.RL)(this["x-axis-tick-rotate"]).num,format:this.localeFormat},height:(0,n.RL)(this["x-axis-tick-height"]).num},y:{label:{text:this["y-axis-label-text"],position:this["y-axis-label-position"]},tick:{format:this.localeFormat}}},grid:{y:{show:this["show-grid"]},x:{show:this["show-grid"]}},point:{show:this["show-line-point"]}}}generateChart(){this.chart=(0,a.generate)(this.chartOptions),this.drawChartData()}slotChanges(){this.shadowRoot.querySelector("slot:not([name])").addEventListener("slotchange",this.drawChartBinded)}firstUpdated(t){super.firstUpdated(t),this.slotChanges(),this.chartOptions=this.initChartOptions(),this.chartDataList=this.mutateChartData(),this.generateChart()}updateLabelsByPosition(){const t=this.getChartRotation();"inner"===this["labels-position"]&&this.setLabelsPosition(t)}getChartRotation(){return this["axis-rotate"]?"horizontal":"vertical"}setLabelsPosition(t){const{coordinate:e,property:r,isNegative:i}=this.constructor.getLabelPresets()[t],a=i?"-":"",o=(0,n.RL)(this["labels-inner-indent"]).num;Array.from(this.shadowRoot.querySelectorAll(`.custom-labels-${this.id}`)).map((t=>t.setAttribute(e,`${a}${t.getBBox()[r]+o}`)))}static getLabelPresets(){return{horizontal:{property:"width",coordinate:"dx",isNegative:!0},vertical:{property:"height",coordinate:"dy",isNegative:!1}}}static get styles(){return[super.styles,i.iv`
        :host {
          display: block;
        }
        :host #chart {
          margin: 0 auto;
          height: var(--height);
          font-family: var(--font-family);
          text-align: center;
          z-index: 1;
        }
        /*-- Chart --*/
        .c3 svg {
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
        .c3 path, .c3 line {
          fill: none;
          stroke: #000000;
        }
        .c3 text {
          -webkit-user-select: none;
          -moz-user-select: none;
          user-select: none;
        }
        .c3-text {
          fill: var(--labels-color) !important;
          font-size: var(--labels-font-size);
          font-weight: var(--labels-font-weight);
        }
        .c3-axis-x {
          font-size: var(--x-axis-font-size);
          font-weight: var(--x-axis-font-weight);
        }
        .c3-axis-x-label {
          fill: var(--x-axis-label-color);
          font-size: var(--x-axis-label-font-size);
          font-weight: var(--x-axis-label-font-weight);
        }
        .c3-axis-y {
          font-size: var(--y-axis-font-size);
          font-weight: var(--y-axis-font-weight);
        }
         .c3-axis-y-label {
          fill: var(--y-axis-label-color);
          font-size: var(--y-axis-label-font-size);
          font-weight: var(--y-axis-label-font-weight);
        }
        .c3-legend-item-tile,
        .c3-xgrid-focus,
        .c3-ygrid,
        .c3-event-rect,
        .c3-bars path {
          shape-rendering: crispEdges;
        }
        .c3-chart-arc path {
          stroke: #ffffff;
        }
        .c3-chart-arc rect {
          stroke: white;
          stroke-width: 1;
        }
        .c3-chart-arc text {
          fill: #ffffff;
          font-size: 13px;
        }
        /*-- Axis --*/
        /*-- Grid --*/
        .c3-grid line {
          stroke: #aaaaaa;
        }
        .c3-grid text {
          fill: #aaaaaa;
        }
        .c3-xgrid, .c3-ygrid {
          stroke-dasharray: 3 3;
        }
        /*-- Text on Chart --*/
        .c3-text.c3-empty {
          fill: #808080;
          font-size: 2em;
        }
        /*-- Line --*/
        .c3-line {
          stroke-width: 1px;
        }
        /*-- Point --*/
        .c3-circle._expanded_ {
          stroke-width: 1px;
          stroke: white;
        }
        .c3-selected-circle {
          fill: white;
          stroke-width: 2px;
        }
        /*-- Bar --*/
        .c3-bar {
          stroke-width: 0;
        }
        .c3-bar._expanded_ {
          fill-opacity: 1;
          fill-opacity: 0.75;
        }
        /*-- Focus --*/
        .c3-target.c3-focused {
          opacity: 1;
        }
        .c3-target.c3-focused path.c3-line, .c3-target.c3-focused path.c3-step {
          stroke-width: 2px;
        }
        .c3-target.c3-defocused {
          opacity: 0.3 !important;
        }
        /*-- Region --*/
        .c3-region {
          fill: steelblue;
          fill-opacity: 0.1;
        }
        /*-- Brush --*/
        .c3-brush .extent {
          fill-opacity: 0.1;
        }
        /*-- Select - Drag --*/
        /*-- Legend --*/
        .c3-legend-item {
          font-size: 12px;
        }
        .c3-legend-item-hidden {
          opacity: 0.15;
        }
        .c3-legend-background {
          opacity: 0.75;
          fill: transparent;
          stroke: lightgray;
          stroke-width: 0;
        }
        /*-- Title --*/
        .c3-title {
          font-size: 14px;
        }
        /*-- Tooltip --*/
        .c3-tooltip-container {
          z-index: 10;
        }
        .c3-tooltip {
          border-collapse: collapse;
          border-spacing: 0;
          background-color: #ffffff;
          empty-cells: show;
          -webkit-box-shadow: 7px 7px 12px -9px #777777;
          -moz-box-shadow: 7px 7px 12px -9px #777777;
          box-shadow: 7px 7px 12px -9px #777777;
          opacity: 0.9;
        }
        .c3-tooltip tr {
          border: 1px solid #cccccc;
        }
        .c3-tooltip th {
          background-color: #aaaaaa;
          font-size: 14px;
          padding: 2px 5px;
          text-align: left;
          color: #ffffff;
        }
        .c3-tooltip td {
          font-size: 13px;
          padding: 3px 6px;
          background-color: #ffffff;
          border-left: 1px dotted #999999;
          text-align: left;
        }
        .c3-tooltip td > span {
          display: inline-block;
          width: 10px;
          height: 10px;
          margin-right: 6px;
        }
        .c3-tooltip td.value {
          text-align: right;
        }
        /*-- Area --*/
        .c3-area {
          stroke-width: 0;
          opacity: 0.2;
        }
        /*-- Arc --*/
        .c3-chart-arcs-title {
          dominant-baseline: middle;
          font-size: 1.3em;
        }
        .c3-chart-arcs .c3-chart-arcs-background {
          fill: #e0e0e0;
          stroke: #ffffff;
        }
        .c3-chart-arcs .c3-chart-arcs-gauge-unit {
          fill: #000000;
          font-size: 16px;
        }
        .c3-chart-arcs .c3-chart-arcs-gauge-max {
          fill: #777777;
        }
        .c3-chart-arcs .c3-chart-arcs-gauge-min {
          fill: #777777;
        }
        .c3-chart-arc .c3-gauge-value {
          fill: #000000;
        /*  font-size: 28px !important;*/
        }
        .c3-chart-arc.c3-target g path {
          opacity: 1;
        }
        .c3-chart-arc.c3-target.c3-focused g path {
          opacity: 1;
        }
        /*-- Zoom --*/
        .c3-drag-zoom.enabled {
          pointer-events: all !important;
          visibility: visible;
        }
        .c3-drag-zoom.disabled {
          pointer-events: none !important;
          visibility: hidden;
        }
        .c3-drag-zoom .extent {
          fill-opacity: 0.1;
        }
      `]}render(){return super.render(),i.dy`
      <style>
       ${this.dynamicStyles}
      </style>
      <div id='chart'></div>
      <slot></slot>
      ${this.constructor.systemSlotTemplate}
    `}}},8247:(t,e,r)=>{var i={"./ar-001.json":139,"./ar-AE.json":3197,"./ar-BH.json":6760,"./ar-DJ.json":6602,"./ar-DZ.json":4244,"./ar-EG.json":7561,"./ar-EH.json":3377,"./ar-ER.json":9722,"./ar-IL.json":1066,"./ar-IQ.json":1466,"./ar-JO.json":2232,"./ar-KM.json":2169,"./ar-KW.json":4084,"./ar-LB.json":7649,"./ar-LY.json":7364,"./ar-MA.json":6147,"./ar-MR.json":8308,"./ar-OM.json":8567,"./ar-PS.json":7567,"./ar-QA.json":5586,"./ar-SA.json":6973,"./ar-SD.json":4407,"./ar-SO.json":3371,"./ar-SS.json":9007,"./ar-SY.json":3225,"./ar-TD.json":4965,"./ar-TN.json":8055,"./ar-YE.json":9989,"./ca-ES.json":28,"./cs-CZ.json":3268,"./de-CH.json":6141,"./de-DE.json":1509,"./en-CA.json":9287,"./en-GB.json":7751,"./en-IE.json":836,"./en-IN.json":4690,"./en-US.json":7486,"./es-BO.json":4693,"./es-ES.json":2747,"./es-MX.json":4110,"./fi-FI.json":8630,"./fr-CA.json":8986,"./fr-FR.json":1127,"./he-IL.json":7461,"./hu-HU.json":2124,"./it-IT.json":7362,"./ja-JP.json":3204,"./ko-KR.json":7109,"./mk-MK.json":5036,"./nl-NL.json":5969,"./pl-PL.json":2769,"./pt-BR.json":863,"./ru-RU.json":9394,"./sv-SE.json":5107,"./uk-UA.json":7052,"./zh-CN.json":9032};function a(t){var e=o(t);return r(e)}function o(t){if(!r.o(i,t)){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}return i[t]}a.keys=function(){return Object.keys(i)},a.resolve=o,t.exports=a,a.id=8247},7444:(t,e,r)=>{var i={"./custom_FR.json":6906};function a(t){var e=o(t);return r(e)}function o(t){if(!r.o(i,t)){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}return i[t]}a.keys=function(){return Object.keys(i)},a.resolve=o,t.exports=a,a.id=7444},6906:t=>{"use strict";t.exports=JSON.parse('{"decimal":",","thousands":" ","grouping":[3],"currency":[""," €"],"percent":" %"}')}}]);