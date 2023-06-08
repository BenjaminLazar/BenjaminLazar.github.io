"use strict";(self.webpackChunkbasic_shared_resource=self.webpackChunkbasic_shared_resource||[]).push([[383],{7383:(t,e,o)=>{o.r(e),o.d(e,{FusionAudioPlayer:()=>m});var i=o(3361),s=o(1762),a=o(8388),r=o(7475),l=o(705),n=o(3291);const u="M18 12L0 24V0",d="M0 0h6v24H0zM12 0h6v24h-6z",h="M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z",p="M0 7.667v8h5.333L12 22.333V1L5.333 7.667M17.333 11.373C17.333 9.013 16 6.987 14 6v10.707c2-.947 3.333-2.987 3.333-5.334z",c="M0 7.667v8h5.333L12 22.333V1L5.333 7.667";class m extends((0,l.applyMixins)(s.v,[l.SlideComponentBase,l.ModeTrackable,n.Asset,n.Dimensions,n.Display,n.Background,n.Container,n.FieldDefinition])){constructor(){super(),this.sliderMinWidth=65}static get options(){return{...super.options,componentName:"fusion-audio-player",componentContentType:"audio",componentType:"dynamic",componentUIName:"Audio Player",componentCategory:"media",componentDescription:"Container for audio files handling playback and states",nestedComponents:[],fileExtensions:["mp3","wav"]}}static get properties(){const{top:t,left:e,width:o,src:i,opacity:s,"background-color":a,position:l}=super.properties;return{src:{...i,value:"",assetType:"Audio",propertyGroup:"audio"},position:l,top:{...t},left:{...e},opacity:s,width:{...o,value:"410px"},"background-color":{...a,propertyGroup:"audio",value:"rgb(240, 240, 240)"},"main-color":{type:String,fieldType:"ColorPicker",propertyGroup:"audio",value:"rgb(97, 114, 142)"},"additional-color":{type:String,fieldType:"ColorPicker",propertyGroup:"audio",value:"rgb(68, 191, 163)"},autoplay:{type:Boolean,fieldType:"Boolean",propertyGroup:"audio",value:(0,r.a2)(),prop:!0},"show-volume-handler":{type:Boolean,fieldType:"Boolean",propertyGroup:"audio",value:(0,r.a2)(),prop:!0,dependencyProps:[{value:!0,props:["additional-color"],action:"show"},{value:!1,props:["additional-color"],action:"hide"}]},"show-progress-slider":{type:Boolean,fieldType:"Boolean",propertyGroup:"audio",value:(0,r.a2)(),prop:!0},"show-current-time":{type:Boolean,fieldType:"Boolean",propertyGroup:"audio",value:!1,prop:!0},"show-total-time":{type:Boolean,fieldType:"Boolean",propertyGroup:"audio",value:(0,r.a2)(),prop:!0},"show-volume":{type:Boolean,fieldType:"Boolean",propertyGroup:"audio",value:(0,r.a2)(),prop:!0}}}getAudioPlayerPart(){return{"show-progress-slider":this.progressControls,"show-current-time":this.currentTime,"show-total-time":this.totalTime,"show-volume":this.volumeButton}}editorModeChanged(t){t&&this.audio&&(0,r.j0)(this.audio)}updateAudioPlayerPartStyle(){const t=this.getAudioPlayerPart();Object.keys(t).forEach((e=>{const o=this[e]?"showAudioPlayerPart":"hideAudioPlayerPart";return m[o](t[e])}))}updateWidthByPropChanges(){const t=this.getCurrentSliderWidth(),e=this.getActualInnerMinWidth(t),o=(e/this.parentElement.offsetWidth*100).toFixed(2),{num:i,unit:s}=(0,r.RL)(this.width),a="%"===s?o:e;i<a&&(this.setElementProp("width",`${a}${s}`),this.setAttribute("width",`${a}${s}`))}update(t){super.update(t),this.isRendered&&(this.updateAudioPlayerPartStyle(),this.updateWidthByPropChanges(),t.has("src")&&this.togglePlayButtonStyle(),m.isVolumeControls(t)&&this.updateVolumeControls(t))}static isVolumeControls(t){return t.has("show-volume-handler")||t.has("show-volume")}togglePlayButtonStyle(){const t=m.options.fileExtensions.includes(this.src.split(".").pop())?"remove":"add";this.playPauseButton.classList[t]("disabled")}updateVolumeControls(t){const e=Array.from(t.keys());return this.getControlsMethods()[m.getControlsName(e)]()}static getControlsName(t){return t.find((t=>"show-volume-handler"===t||"show-volume"===t))}getControlsMethods(){return{"show-volume-handler":()=>this.updateVolumeHandler(),"show-volume":()=>this.updateVolumeControlClasses()}}updateVolumeHandler(){this["show-volume-handler"]?this.volumeAdjust.bind(this):this.updateVolumeButtonIcon(),this.updateVolumeControlClasses()}updateVolumeControlClasses(){this.volumeButton.classList.remove("open"),this.volumeControls.classList.add("hidden")}getCurrentSliderWidth(){const t=m.getElementPadding(this.progressControls);return this.progressControls.offsetWidth-t}static getElementPadding(t){const{paddingLeft:e,paddingRight:o}=window.getComputedStyle(t);return parseFloat(e)+parseFloat(o)}getActualInnerMinWidth(t){return m.getElementPadding(this.audioPlayer)+this.getInnerElementsWidth(t)}getInnerElementsWidth(t){return[this.progressControls.classList.contains("hidden")?0:t,...[this.playPauseButton,this.currentTime,this.totalTime,this.volumeButton].map((t=>t.offsetWidth))].reduce(((t,e)=>t+e),0)}static showAudioPlayerPart(t){t&&t.classList.remove("hidden")}static hideAudioPlayerPart(t){t&&t.classList.add("hidden")}showAudioPlayer(){this.audioPlayer.classList.remove("hide-player")}hideAudioPlayer(){this.audioPlayer.classList.add("hide-player")}play(){this.audio&&this.audio.play()}pause(){this.audio.pause()}stop(){(0,r.j0)(this.audio)}parentStateChanged(t){super.parentStateChanged(t),this.stop()}triggerPlay(t){m.setButtonIcon(this.playPauseIcon,d),this.emitCustomEvent(t.type)}triggerPause(t){m.setButtonIcon(this.playPauseIcon,u),this.emitCustomEvent(t.type)}togglePlay(){this.audio.paused?this.play():this.pause()}static setButtonIcon(t,e){t&&e&&(t.attributes.d.value=e)}updateVolumeButtonIcon(){this.audio.volume>=.5?m.setButtonIcon(this.volumeIcon,h):this.audio.volume<.5&&this.audio.volume>0?m.setButtonIcon(this.volumeIcon,p):this.audio.volume<=0&&m.setButtonIcon(this.volumeIcon,c)}showVolumeSlider(){this["show-volume-handler"]?this.toggleVolumeControlsClasses():this.toggleVolume()}toggleVolumeControlsClasses(){this.volumeButton.classList.toggle("open"),this.volumeControls.classList.toggle("hidden")}toggleVolume(){this.audio.volume?(this.audio.volume=0,m.setButtonIcon(this.volumeIcon,h)):(this.audio.volume=1,m.setButtonIcon(this.volumeIcon,c))}updateProgress(){const t=this.audio.currentTime;this.audio.duration&&(this.progressSlider["start-value"]=t*m.getCoefficient(this.audio.duration,this.progressSlider["max-value"])),this.currentTime.textContent=m.formatTime(t)}static getCoefficient(t,e){return e/t}static formatTime(t){const e=Math.floor(t/60),o=Math.floor(t%60);return`${e}:${o<10?`0${o}`:o}`}setTotalTime(){this.totalTime.textContent=m.formatTime(this.audio.duration)}volumeAdjust(t){var e;void 0!==(null===(e=this.audio)||void 0===e?void 0:e.volume)&&(this.audio.volume=t.detail*m.getCoefficient(this.volumeSlider["max-value"],1))}changeProgress(t){var e;null!==(e=this.audio)&&void 0!==e&&e.duration&&(this.audio.currentTime=this.audio.duration*(t.offsetX/this.progressSlider.clientWidth))}setListenerType(t){this.events.forEach((e=>{e.target[t](e.event,e.handler)}))}handleAudioEnd(t){this.pause(),this.audio.currentTime=0,this.progressSlider["start-value"]=0,this.emitCustomEvent(t.type)}startAutoPlay(){const t=this.audio.play();void 0!==t&&t.then((()=>{})).catch((t=>a.b.error(`${t} ${this.constructor.options.componentName}`,this.constructor.options.componentUIName)))}firstUpdated(t){super.firstUpdated(t),this.audioPlayer=this.shadowRoot.querySelector(".custom-audio-player"),this.playPauseIcon=this.audioPlayer.querySelector(".play-pause-icon"),this.playPauseButton=this.audioPlayer.querySelector(".play-pause-button"),this.progressSlider=this.audioPlayer.querySelector(".progress-slider"),this.progressControls=this.audioPlayer.querySelector(".controls"),this.volumeSlider=this.audioPlayer.querySelector(".volume-slider"),this.volumeButton=this.audioPlayer.querySelector(".volume-button"),this.volumeControls=this.audioPlayer.querySelector(".volume-controls"),this.audio=this.audioPlayer.querySelector("audio"),this.currentTime=this.audioPlayer.querySelector(".current-time"),this.totalTime=this.audioPlayer.querySelector(".total-time"),this.volumeIcon=this.audioPlayer.querySelector(".volume-icon"),this.autoplay&&this.src&&this.startAutoPlay(),this.togglePlayButtonStyle(),this.updateAudioPlayerPartStyle(),this.events=[{target:this.playPauseButton,event:"click",handler:this.togglePlay.bind(this)},{target:this.audio,event:"timeupdate",handler:this.updateProgress.bind(this)},{target:this.audio,event:"volumechange",handler:this.updateVolumeButtonIcon.bind(this)},{target:this.audio,event:"play",handler:this.triggerPlay.bind(this)},{target:this.audio,event:"pause",handler:this.triggerPause.bind(this)},{target:this.audio,event:"loadedmetadata",handler:this.setTotalTime.bind(this)},{target:this.volumeButton,event:"click",handler:this.showVolumeSlider.bind(this)},{target:this.volumeSlider,event:"slider-change",handler:this.volumeAdjust.bind(this)},{target:this.progressSlider,event:"click",handler:this.changeProgress.bind(this)},{target:this.audio,event:"ended",handler:this.handleAudioEnd.bind(this)}],this.audio&&this.setListenerType("addEventListener")}disconnectedCallback(){super.disconnectedCallback(),this.setListenerType("removeEventListener")}static get styles(){return[super.styles,i.iv`
        :host {
          height: 50px;
          min-height: 35px;
        }
        :host .custom-audio-player {
          height: 100%;
          box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 15px;
          border-radius: 4px;
          user-select: none;
          background: var(--background-color);
        }
        :host .progress-slider {
          top: 50%;
          left: 0;
        }
        :host .slider {
          position: relative;
        }
        :host .time-output {
          padding: 0 7px;
          color: var(--main-color);
        }
        :host button {
          padding: 0 7px;
          border: none;
          background: no-repeat;
          outline: #cccccc;
          cursor: pointer;
        }
        :host button.disabled {
          pointer-events: none;
          opacity: 0.5;
        }
        :host .volume-inner {
          position: relative;
          width: 100%;
          height: 100%;
        }
        :host .volume-slider {
          top: 50%;
          left: 0;
          right: 0;
          transform: rotate(-90deg) translate(-50%);
          transform-origin: top left;
        }
        :host .controls {
          position: relative;
          display: flex;
          flex-grow: 1;
          justify-content: space-between;
          align-items: center;
          padding: 0 7px;
          font-size: 16px;
          line-height: 18px;
          color: #55606E;
        }
        :host .volume {
          position: relative;
          display: flex;
          align-items: center;
        }
        :host .volume-button {
          cursor: pointer;
        }
        :host .volume-button path {
          fill: var(--main-color);
        }
        :host .volume-button.open path {
          fill: var(--additional-color);
        }
        :host .play-pause-button path {
          fill: var(--main-color);
        }
        :host .hide-player {
          opacity: 0;
        }
        :host .volume-controls {
          position: absolute;
          left: 50%;
          bottom: 52px;
          display: flex;
          width: 30px;
          height: 135px;
          flex-direction: column;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.62);
          border-radius: 7px;
          transform: translate(-50%);
          z-index: 1;
        }
        :host .hidden {
          display: none;
        }
        :host .volume-controls .slider {
          width: 125px;
          height: 30px;
          margin: auto;
          border-radius: 3px;
        }
        :host svg {
          display: block;
        }
        :host(.${(0,i.$m)(l.ModeTrackable.EditModeClassName)}) .custom-audio-player {
          pointer-events: none;
        }
      `]}render(){return i.dy`
      <style>
        ${super.dynamicStyles}
      </style>
      <div class='custom-audio-player'>
        <button class='play-pause-button'>
          <svg xmlns='http://www.w3.org/2000/svg' width='18' height='24' viewBox='0 0 18 24'>
            <path fill='#566574' fill-rule='evenodd' d='M18 12L0 24V0' class='play-pause-icon'/>
          </svg>
        </button>
        <output class='current-time time-output'>0:00</output>
        <div class='controls'>
          <fusion-slider class='progress-slider slider' height='6px' slider-height='6px' background='#aaa' width='100%' min-value='0' max-value='100' start-value='0'  step='1' radius='18px'></fusion-slider>
        </div>
        <output class='total-time time-output' >0:00</output>
        <div class='volume'>
          <button class='volume-button'>
            <svg xmlns='' width='24' height='24' viewBox='0 0 24 24'>
              <path fill='#566574' fill-rule='evenodd' d='M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z' class='volume-icon'/>
            </svg>
          </button>
          <div class='volume-controls hidden'>
            <div class='volume-inner'>
             <fusion-slider class='slider volume-slider' height='6px' slider-height='6px' background='#aaa' width='115px' min-value='1' max-value='100' start-value='100' step='1' radius='18px'></fusion-slider>
            </div>
          </div>
        </div>
        <audio src=${this.src}></audio>
      </div>
      ${this.constructor.systemSlotTemplate}
    `}}}}]);