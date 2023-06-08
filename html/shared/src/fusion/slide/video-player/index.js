import { html, unsafeCSS } from 'lit-element';
import { resetPlayer } from '../../utils';
import {
  applyMixins,
  ModeTrackable,
  SlideComponentBase,
  ContentModule,
} from '../../mixins';
import { FusionBase } from '../../base';
import {
  Container,
  Video,
  Dimensions,
  Display,
  FieldDefinition,
} from '../../mixins/props';
import { FusionApi } from '../../api';

class FusionVideoPlayer extends applyMixins(FusionBase, [
  SlideComponentBase,
  ModeTrackable,
  Video,
  Container,
  Display,
  Dimensions,
  ContentModule,
  FieldDefinition,
]) {
  static get properties() {
    const {
      top,
      left,
      width,
      height,
      'padding-top': paddingTop,
      'padding-right': paddingRight,
      'padding-bottom': paddingBottom,
      'padding-left': paddingLeft,
      overflow,
      src,
      'should-shown': shouldShown,
      ...rest
    } = super.properties;
    return {
      src,
      poster: {
        ...src,
        propertyGroup: 'media',
        fieldType: 'Modal',
        value: '../shared/src/fusion/slide/video-player/assets/images/fusion-video-poster.jpg',
        assetType: 'Image',
      },
      top,
      left,
      videoIsPlaying: {
        type: Boolean,
        fieldType: 'hidden',
        value: false,
      },
      width: {
        ...width,
        value: '600px',
      },
      height: {
        ...height,
        value: '400px',
      },
      ...rest,
      'should-shown': {
        ...shouldShown,
        value: true,
      },
      identifier: {
        attribute: 'id',
        fieldType: 'hidden',
        propertyGroup: 'controls',
      },
    };
  }

  static get options() {
    return {
      ...super.options,
      componentName: 'fusion-video-player',
      componentContentType: 'video',
      componentUIName: 'Video Player',
      componentCategory: 'media',
      componentDescription: 'Container for video files handling playback and states',
      nestedComponents: [],
    };
  }

  setListenerType(eventType) {
    this.events.forEach((item) => {
      item.target[eventType](item.event, item.handler);
    });
  }

  triggerEvent(event) {
    this.emitCustomEvent(event.type);
  }

  setContentModule(content) {
    this.setAttribute('src', content);
  }

  update(changedProps) {
    super.update(changedProps);
    if (this.isRendered && changedProps.has('muted')) {
      this.video.muted = this.muted;
    }
  }

  async updated(changedProps) {
    super.updated(changedProps);

    if (this.isRendered && changedProps.has('autoplay')) {
      this.setAttribute('muted', this.autoplay);
      await FusionApi.updateAttributeList({
        attrList: [{ attrKey: 'muted', attrValue: this.autoplay }],
        isComponent: true,
        selectorId: this.id,
      });
    }

    // if the src is changed, we stop the video playing
    if (this.isRendered && changedProps.has('src') && changedProps.get('src') !== this.src) {
      this.stopVideoPlaying();
    }
  }

  closeOtherPlayers() {
    const allVideos = Array.from(document.querySelectorAll('fusion-video-player'));

    allVideos.forEach((videoPlayer) => {
      if (this !== videoPlayer) {
        videoPlayer.stopVideoPlaying();
      }
    });
  }

  onVideoPlay(e) {
    this.videoIsPlaying = !!e.returnValue;
    this.closeOtherPlayers();
  }

  firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    this.prepareVideo();
  }

  prepareVideo() {
    this.video = this.querySelector('video');

    if (!this.video) {
      return;
    }

    if (!this.hasAttribute('ratio')) {
      this.setCalculatedRatio();
    }

    this.events = [
      {
        target: this.video,
        event: 'loadeddata',
        handler: this.calculateRatio.bind(this),
      },
      {
        target: this.video,
        event: 'play',
        handler: this.triggerEvent.bind(this),
      },
      {
        target: this.video,
        event: 'play',
        handler: this.onVideoPlay.bind(this),
      },
      {
        target: this.video,
        event: 'pause',
        handler: this.triggerEvent.bind(this),
      },
      {
        target: this.video,
        event: 'ended',
        handler: this.triggerEvent.bind(this),
      },
    ];

    this.setListenerType('addEventListener');

    if (this.muted) {
      this.video.muted = this.muted;
    }

    // if we have autoplay, we need to set the src on the video from the beginning
    if (this.autoplay && !FusionApi.isEditMode) {
      this.video.src = this.src;
      // changing so it's updated
      this.videoIsPlaying = true;
    }
  }

  async onPosterClick() {
    if (!this.video.getAttribute('src')) {
      this.video.src = this.src;
    }
    if (this.getAttribute('src')?.trim()) {
      this.video?.play();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('swipeleft', this.constructor.stopPropagation);
    this.addEventListener('swiperight', this.constructor.stopPropagation);
  }

  static stopPropagation(event) {
    event.stopPropagation();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.setListenerType('removeEventListener');
  }

  stopVideoPlaying() {
    if (this.video) {
      resetPlayer(this.video);
      this.videoIsPlaying = false;
      this.video.src = '';
      this.requestUpdate();
    }
  }

  async parentStateChanged(parentState) {
    super.parentStateChanged(parentState);
    this.stopVideoPlaying();
  }

  editorModeChanged(isEditMode) {
    if (isEditMode) {
      this.stopVideoPlaying();
    }
  }

  setCalculatedRatio(videoWidth = 0, videoHeight = 0) {
    const { clientWidth, clientHeight } = this.video;
    const ratio = videoWidth && videoHeight ? videoWidth / videoHeight : clientWidth / clientHeight;
    this.setAttribute('ratio', ratio);
    this.requestUpdate('lock-aspect-ratio');
  }

  calculateRatio(event) {
    const { videoWidth, videoHeight } = event.currentTarget;
    this.setCalculatedRatio(videoWidth, videoHeight);
  }

  createRenderRoot() {
    return this;
  }

  render() {
    const selector = `#${this.identifier}`;
    return html`
      <style>
        ${selector} {
          position: ${this.position};
          top: ${this.top};
          left: ${this.left};
          width: ${this.width};
          height: ${this.height};
          opacity: calc(${this.opacity / 100});
          z-index: 1;
          display: block;
        }
        ${selector} video {
          object-fit: cover;
        }
        ${selector}:not([src]) video,
        ${selector}:not([src]) .video-poster,
        ${selector}.${unsafeCSS(ModeTrackable.EditModeClassName)} video,
        ${selector}.${unsafeCSS(ModeTrackable.NoteModeClassName)} video,
        ${selector}.${unsafeCSS(ModeTrackable.EditModeClassName)} .video-poster,
        ${selector}.${unsafeCSS(ModeTrackable.NoteModeClassName)} .video-poster {
          pointer-events: none;
        }
        ${selector} video:focus {
          outline: none;
        }
        ${selector}[mute-button-hide] video::-webkit-media-controls-mute-button,
        ${selector}[fullscreen-button-hide] video::-webkit-media-controls-fullscreen-button {
          display: none;
        }
        ${selector} .video-container {
          position: relative;
        }
        ${selector} .video-poster {
          display: inline-flex;
          background: rgba(0,0,0, 0.5) url("${this.poster}") 50% 50% no-repeat ;
          background-size: cover;
          cursor: pointer;
          margin: 0;
          padding: 0;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          height: 100%;
        }
        ${selector} .video-poster[hidden] {
          display: none;
        }
      </style>
      <div class="video-container">
          <video
            width="${this.width}"
            height="${this.height}"
            ?autoplay="${this.autoplay}"
            ?muted="${this.muted}"
            ?controls="${this.controls}"
            controlsList="nodownload"
            disablePictureInPicture
            preload="metadata">
              <p>Your browser doesn't support HTML5 video.</p>
          </video>
        <div 
          class="video-poster"
          ?hidden="${this.videoIsPlaying}"
          @click="${this.onPosterClick}"></div>
      </div>`;
  }
}

export { FusionVideoPlayer };
