"use strict";(self.webpackChunkbasic_shared_resource=self.webpackChunkbasic_shared_resource||[]).push([[638],{4638:(t,e,o)=>{o.r(e),o.d(e,{FusionSortableListItem:()=>n});var s=o(3361),r=o(2997);class n extends r.FusionListItem{static get properties(){return{...super.properties,"lock-sort":{type:Boolean,fieldType:"Boolean",propertyGroup:"sortableListItem",value:!1,prop:!0}}}static get options(){return{...super.options,componentName:"fusion-sortable-list-item",componentUIName:"Sortable list item",componentDescription:"Content item to be used in sortable list",nestedComponents:["fusion-nested-sortable-list"]}}static get styles(){return[super.styles,s.iv`
         :host(.sortable-ghost) .content {
          background-color: var(--draggable-background-color);
        }
         :host(.sortable-drag) .content {
          height: auto;
        }
        :host([lock-sort]) .content {
          cursor: auto;
          background-color: var(--locked-background-color);
        }
        :host ::slotted([slot='content']) {
          width: 100%;
        }
      `]}}}}]);