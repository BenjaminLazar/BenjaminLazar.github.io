"use strict";(self.webpackChunkbasic_shared_resource=self.webpackChunkbasic_shared_resource||[]).push([[74],{3074:(e,i,t)=>{t.r(i),t.d(i,{MJMLHtml:()=>r});var s=t(3712),o=t(520),n=t(8132),l=t(5038),d=t(3634),a=t(6283);class r extends((0,d.applyMixins)(o.v,[d.ModeTrackable,d.EmailComponent,d.EmailComponentBaseClasses,a.FieldDefinition])){static get options(){return{...super.options,componentName:"mj-raw",componentCategory:"custom",componentUIName:"HTML",componentDescription:"Custom HTML element",nestedComponents:[],defaultTemplate:'<div class="code-container"></div>'}}static get properties(){return{...super.properties}}constructor(){super(),this.keyCodes={esc:"Escape"}}updateValue(){this.querySelector(".code-container").innerHTML=this.inputFieldEl.value}updated(e){super.updated(e)}swapVisibility(){n.N.isEditMode&&(this.checkHidden(this.inputFieldEl,!0),this.checkHidden(this.componentViewEl))}firstUpdated(e){var i;super.firstUpdated(e),this.inputFieldEl=this.shadowRoot.querySelector(".input-field"),this.componentViewEl=this.shadowRoot.querySelector(".component-view"),this.inputFieldEl.value=this.querySelector(".code-container")?null===(i=this.querySelector(".code-container"))||void 0===i?void 0:i.innerHTML:""}inputKeydownHandler(e){e.key===this.keyCodes.esc&&(this.inputFieldEl.value=this.oldValue,this.inputFieldEl.blur())}setInputFocus(){this.inputFieldEl.focus()}checkHidden(e,i){e.classList.contains("hidden")?(e.classList.remove("hidden"),i&&(e.focus(),this.oldValue=this.inputFieldEl.value)):(e.classList.add("hidden"),i&&e.blur())}static get styles(){return[super.styles,l.v,(0,l.E)("iframe"),s.iv`
        :host {
          display: block;
          width: 100%
        }

        :host .input-field {
          width: 100%;
          height: 96px;
          border-radius: 4px;
          box-sizing: border-box;
          border: 0;
          padding: 0;
          outline: none;
          font-family: "DM Sans", Arial !important;
          resize: none;
          display: block;
          pointer-events: auto;
          font-size: 11px;
          line-height: 16px;
          font-weight: 400;
          padding: 4px;
          box-sizing: border-box;
        }

        :host .input-field.designer {
          background-color: #000000;
          color: #FFFFFF;
        }

        :host .component-view {
          font-family: "DM Sans", Arial !important;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #E8E7E5;
          padding: 12px;
          box-sizing: border-box;
        }

        :host(.${(0,s.$m)(d.ModeTrackable.EditModeClassName)}) .click-text {
          cursor: pointer;
        }

        :host .component-view p {
          font-size: 11px;
          line-height: 16px;
          font-weight: 400;
          color: #1C1C1D;
          margin: 0;
        }

        :host .component-view p.click-text {
          visibility: hidden;
        }

        :host(.${(0,s.$m)(d.ModeTrackable.EditModeClassName)}) .component-view p.click-text {
          visibility: visible;
        }

        :host .title-wrapper {
          display: flex;
          align-items: center;
        }

        :host .title-wrapper i {
          font-size: 16px;
          margin-right: 8px;
        }

        :host .input-field.hidden,
        :host .component-view.hidden {
          display: none;
        }
      `]}render(){return s.dy`
      <textarea
        spellcheck="false"
        class="input-field designer hidden"
        @blur='${()=>this.swapVisibility()}'
        @change='${()=>this.updateValue()}'
        @click='${()=>this.setInputFocus()}'
        @keydown='${e=>this.inputKeydownHandler(e)}'
      ></textarea>
      <div class="component-view">
        <div class="title-wrapper">
          <i class="icon-iframe-outlined"></i>
          <p>Custom HTML</p>
        </div>
        <p class="click-text" @click='${()=>this.swapVisibility()}'>Click to edit</p>
      </div>
      ${this.constructor.systemSlotTemplate}
    `}}}}]);