import { css, html, unsafeCSS } from 'lit-element';
import { FusionBase } from '../../base';
import { FusionLogger } from '../../services/fusion-logger';
import {
  getValueObject,
  isReflectiveBoolean,
  resetPlayer,
} from '../../utils';
import {
  applyMixins,
  ModeTrackable,
  SlideComponentBase,
} from '../../mixins';
import {
  Asset,
  Background,
  Container,
  Dimensions,
  Display,
  FieldDefinition,
} from '../../mixins/props';

const iconsConfig = {
  pause: 'M18 12L0 24V0',
  play: 'M0 0h6v24H0zM12 0h6v24h-6z',
  volumeLow: 'M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z',
  volumeAverage: 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667M17.333 11.373C17.333 9.013 16 6.987 14 6v10.707c2-.947 3.333-2.987 3.333-5.334z',
  volumeHigh: 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667',
};

class FusionAudioPlayer extends applyMixins(FusionBase, [
  SlideComponentBase,
  ModeTrackable,
  Asset,
  Dimensions,
  Display,
  Background,
  Container,
  FieldDefinition,
]) {
  constructor() {
    super();
    this.sliderMinWidth = 65;
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-audio-player',
      componentContentType: 'audio',
      componentType: 'dynamic',
      componentUIName: 'Audio Player',
      componentCategory: 'media',
      componentDescription: 'Container for audio files handling playback and states',
      nestedComponents: [],
      fileExtensions: ['mp3', 'wav'],
    };
  }

  static get properties() {
    const {
      top, left, width, src, opacity, 'background-color': backgroundColor, position,
    } = super.properties;
    return {
      src: {
        ...src,
        value: '',
        assetType: 'Audio',
        propertyGroup: 'audio',
      },
      position,
      top: {
        ...top,
      },
      left: {
        ...left,
      },
      opacity,
      width: {
        ...width,
        value: '410px',
      },
      'background-color': {
        ...backgroundColor,
        propertyGroup: 'audio',
        value: 'rgb(240, 240, 240)',
      },
      'main-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'audio',
        value: 'rgb(97, 114, 142)',
      },
      'additional-color': {
        type: String,
        fieldType: 'ColorPicker',
        propertyGroup: 'audio',
        value: 'rgb(68, 191, 163)',
      },
      autoplay: {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'audio',
        value: isReflectiveBoolean(),
        prop: true,
      },
      'show-volume-handler': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'audio',
        value: isReflectiveBoolean(),
        prop: true,
        dependencyProps: [
          {
            value: true,
            props: ['additional-color'],
            action: 'show',
          },
          {
            value: false,
            props: ['additional-color'],
            action: 'hide',
          },
        ],
      },
      'show-progress-slider': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'audio',
        value: isReflectiveBoolean(),
        prop: true,
      },
      'show-current-time': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'audio',
        value: false,
        prop: true,
      },
      'show-total-time': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'audio',
        value: isReflectiveBoolean(),
        prop: true,
      },
      'show-volume': {
        type: Boolean,
        fieldType: 'Boolean',
        propertyGroup: 'audio',
        value: isReflectiveBoolean(),
        prop: true,
      },
    };
  }

  getAudioPlayerPart() {
    return {
      'show-progress-slider': this.progressControls,
      'show-current-time': this.currentTime,
      'show-total-time': this.totalTime,
      'show-volume': this.volumeButton,
    };
  }

  editorModeChanged(isEditMode) {
    if (isEditMode && this.audio) {
      resetPlayer(this.audio);
    }
  }

  updateAudioPlayerPartStyle() {
    const playerParts = this.getAudioPlayerPart();
    Object.keys(playerParts).forEach((item) => {
      const toggleAudioPlayerPart = this[item] ? 'showAudioPlayerPart' : 'hideAudioPlayerPart';
      return FusionAudioPlayer[toggleAudioPlayerPart](playerParts[item]);
    });
  }

  updateWidthByPropChanges() {
    const sliderWidth = this.getCurrentSliderWidth();
    const actualMinWidth = this.getActualInnerMinWidth(sliderWidth);
    const actualPercentMinWidth = ((actualMinWidth / this.parentElement.offsetWidth) * 100).toFixed(2);
    const { num, unit } = getValueObject(this.width);
    const handledValue = unit === '%' ? actualPercentMinWidth : actualMinWidth;
    if (num < handledValue) {
      this.setElementProp('width', `${handledValue}${unit}`);
      this.setAttribute('width', `${handledValue}${unit}`);
    }
  }

  update(changedProps) {
    super.update(changedProps);
    if (this.isRendered) {
      this.updateAudioPlayerPartStyle();
      this.updateWidthByPropChanges();
      if (changedProps.has('src')) this.togglePlayButtonStyle();
      if (FusionAudioPlayer.isVolumeControls(changedProps)) this.updateVolumeControls(changedProps);
    }
  }

  static isVolumeControls(changedProps) {
    return changedProps.has('show-volume-handler') || changedProps.has('show-volume');
  }

  togglePlayButtonStyle() {
    const audioExtension = FusionAudioPlayer.options.fileExtensions;
    const isPathExists = audioExtension.includes(this.src.split('.').pop());
    const method = isPathExists ? 'remove' : 'add';
    this.playPauseButton.classList[method]('disabled');
  }

  updateVolumeControls(changedProps) {
    const propertyNames = Array.from(changedProps.keys());
    const methods = this.getControlsMethods();
    const controlName = FusionAudioPlayer.getControlsName(propertyNames);
    return methods[controlName]();
  }

  static getControlsName(props) {
    return props.find((item) => item === 'show-volume-handler' || item === 'show-volume');
  }

  getControlsMethods() {
    return {
      'show-volume-handler': () => this.updateVolumeHandler(),
      'show-volume': () => this.updateVolumeControlClasses(),
    };
  }

  updateVolumeHandler() {
    this['show-volume-handler'] ? this.volumeAdjust.bind(this) : this.updateVolumeButtonIcon();
    this.updateVolumeControlClasses();
  }

  updateVolumeControlClasses() {
    this.volumeButton.classList.remove('open');
    this.volumeControls.classList.add('hidden');
  }

  getCurrentSliderWidth() {
    const padding = FusionAudioPlayer.getElementPadding(this.progressControls);
    return this.progressControls.offsetWidth - padding;
  }

  static getElementPadding(element) {
    const { paddingLeft, paddingRight } = window.getComputedStyle(element);
    return parseFloat(paddingLeft) + parseFloat(paddingRight);
  }

  getActualInnerMinWidth(value) {
    const padding = FusionAudioPlayer.getElementPadding(this.audioPlayer);
    const width = this.getInnerElementsWidth(value);
    return padding + width;
  }

  getInnerElementsWidth(value) {
    const initialWidth = 0;
    const sliderMinWidth = this.progressControls.classList.contains('hidden') ? initialWidth : value;
    const elements = [this.playPauseButton, this.currentTime, this.totalTime, this.volumeButton];
    const innerElementsWidth = [sliderMinWidth, ...elements.map((item) => item.offsetWidth)];
    return innerElementsWidth.reduce((prev, next) => prev + next, 0);
  }

  static showAudioPlayerPart(part) {
    if (part) {
      part.classList.remove('hidden');
    }
  }

  static hideAudioPlayerPart(part) {
    if (part) {
      part.classList.add('hidden');
    }
  }

  showAudioPlayer() {
    this.audioPlayer.classList.remove('hide-player');
  }

  hideAudioPlayer() {
    this.audioPlayer.classList.add('hide-player');
  }

  play() {
    if (this.audio) {
      this.audio.play();
    }
  }

  pause() {
    this.audio.pause();
  }

  stop() {
    resetPlayer(this.audio);
  }

  parentStateChanged(parentState) {
    super.parentStateChanged(parentState);
    this.stop();
  }

  triggerPlay(e) {
    FusionAudioPlayer.setButtonIcon(this.playPauseIcon, iconsConfig.play);
    this.emitCustomEvent(e.type);
  }

  triggerPause(e) {
    FusionAudioPlayer.setButtonIcon(this.playPauseIcon, iconsConfig.pause);
    this.emitCustomEvent(e.type);
  }

  togglePlay() {
    this.audio.paused ? this.play() : this.pause();
  }

  static setButtonIcon(element, iconType) {
    if (element && iconType) {
      element.attributes.d.value = iconType;
    }
  }

  updateVolumeButtonIcon() {
    if (this.audio.volume >= 0.5) {
      FusionAudioPlayer.setButtonIcon(this.volumeIcon, iconsConfig.volumeLow);
    } else if (this.audio.volume < 0.5 && this.audio.volume > 0) {
      FusionAudioPlayer.setButtonIcon(this.volumeIcon, iconsConfig.volumeAverage);
    } else if (this.audio.volume <= 0) {
      FusionAudioPlayer.setButtonIcon(this.volumeIcon, iconsConfig.volumeHigh);
    }
  }

  showVolumeSlider() {
    this['show-volume-handler'] ? this.toggleVolumeControlsClasses() : this.toggleVolume();
  }

  toggleVolumeControlsClasses() {
    this.volumeButton.classList.toggle('open');
    this.volumeControls.classList.toggle('hidden');
  }

  toggleVolume() {
    if (this.audio.volume) {
      this.audio.volume = 0;
      FusionAudioPlayer.setButtonIcon(this.volumeIcon, iconsConfig.volumeLow);
    } else {
      this.audio.volume = 1;
      FusionAudioPlayer.setButtonIcon(this.volumeIcon, iconsConfig.volumeHigh);
    }
  }

  updateProgress() {
    const current = this.audio.currentTime;
    if (this.audio.duration) {
      this.progressSlider['start-value'] = current * FusionAudioPlayer.getCoefficient(this.audio.duration, this.progressSlider['max-value']);
    }
    this.currentTime.textContent = FusionAudioPlayer.formatTime(current);
  }

  static getCoefficient(mainScale, compareScale) {
    return compareScale / mainScale;
  }

  static formatTime(time) {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? `0${sec}` : sec}`;
  }

  setTotalTime() {
    this.totalTime.textContent = FusionAudioPlayer.formatTime(this.audio.duration);
  }

  volumeAdjust(event) {
    const compareScale = 1;
    if (this.audio?.volume !== undefined) {
      this.audio.volume = event.detail * FusionAudioPlayer.getCoefficient(this.volumeSlider['max-value'], compareScale);
    }
  }

  changeProgress(event) {
    if (this.audio?.duration) {
      this.audio.currentTime = this.audio.duration * (event.offsetX / this.progressSlider.clientWidth);
    }
  }

  setListenerType(eventType) {
    this.events.forEach((item) => { item.target[eventType](item.event, item.handler); });
  }

  handleAudioEnd(e) {
    this.pause();
    this.audio.currentTime = 0;
    this.progressSlider['start-value'] = 0;
    this.emitCustomEvent(e.type);
  }

  startAutoPlay() {
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {})
        .catch((error) => FusionLogger.error(`${error} ${this.constructor.options.componentName}`, this.constructor.options.componentUIName));
    }
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.audioPlayer = this.shadowRoot.querySelector('.custom-audio-player');
    this.playPauseIcon = this.audioPlayer.querySelector('.play-pause-icon');
    this.playPauseButton = this.audioPlayer.querySelector('.play-pause-button');
    this.progressSlider = this.audioPlayer.querySelector('.progress-slider');
    this.progressControls = this.audioPlayer.querySelector('.controls');
    this.volumeSlider = this.audioPlayer.querySelector('.volume-slider');
    this.volumeButton = this.audioPlayer.querySelector('.volume-button');
    this.volumeControls = this.audioPlayer.querySelector('.volume-controls');
    this.audio = this.audioPlayer.querySelector('audio');
    this.currentTime = this.audioPlayer.querySelector('.current-time');
    this.totalTime = this.audioPlayer.querySelector('.total-time');
    this.volumeIcon = this.audioPlayer.querySelector('.volume-icon');

    if (this.autoplay && this.src) {
      this.startAutoPlay();
    }
    this.togglePlayButtonStyle();
    this.updateAudioPlayerPartStyle();

    this.events = [
      {
        target: this.playPauseButton,
        event: 'click',
        handler: this.togglePlay.bind(this),
      },
      {
        target: this.audio,
        event: 'timeupdate',
        handler: this.updateProgress.bind(this),
      },
      {
        target: this.audio,
        event: 'volumechange',
        handler: this.updateVolumeButtonIcon.bind(this),
      },
      {
        target: this.audio,
        event: 'play',
        handler: this.triggerPlay.bind(this),
      },
      {
        target: this.audio,
        event: 'pause',
        handler: this.triggerPause.bind(this),
      },
      {
        target: this.audio,
        event: 'loadedmetadata',
        handler: this.setTotalTime.bind(this),
      },
      {
        target: this.volumeButton,
        event: 'click',
        handler: this.showVolumeSlider.bind(this),
      },
      {
        target: this.volumeSlider,
        event: 'slider-change',
        handler: this.volumeAdjust.bind(this),
      },
      {
        target: this.progressSlider,
        event: 'click',
        handler: this.changeProgress.bind(this),
      },
      {
        target: this.audio,
        event: 'ended',
        handler: this.handleAudioEnd.bind(this),
      },
    ];
    if (this.audio) {
      this.setListenerType('addEventListener');
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.setListenerType('removeEventListener');
  }

  static get styles() {
    return [
      super.styles,
      css`
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
        :host(.${unsafeCSS(ModeTrackable.EditModeClassName)}) .custom-audio-player {
          pointer-events: none;
        }
      `,
    ];
  }

  render() {
    return html`
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
    `;
  }
}

export { FusionAudioPlayer };
