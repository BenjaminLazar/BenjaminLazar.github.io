import { contentPreloader } from '../content-preloader';
import { oceMonitoring } from './oce.monitoring';
import { FusionApi } from '../api';
import { FusionStore } from '../services/fusion-store';
import { oceStorage } from './oce.storage';
import { OceSurveyManager } from './oce.survey-manager.js';
import { OceStateManager } from './oce.state-manager.js';
import { EnvironmentDetector } from '../services/environment-detector';
import config from '../../config.json';

const { navigation } = config;

/**
 * class OceEventHandler - service for working with OCE native events and document events.
 */
class OceEventHandler {
  constructor() {
    if (EnvironmentDetector.isOce()) {
      this.constructor.handleSwipes();
      this.constructor.initViewListeners();
    }
  }

  static handleSwipes() {
    if (navigation.customSwipes) {
      this.preventNativeSwipe();
    }
  }

  /**
   * @description disable OCE native swipe area
   */
  static preventNativeSwipe() {
    const id = 'noSwipeRegion';
    const body = document.querySelector('body');
    body.setAttribute('id', id);
    // arguments: (area id - dom element id, x area position, y area position, width of area in points, height width of area in points)
    window.CLMPlayer.defineNoSwipeRegion(id, 0, 0, 9999, 9999);
  }

  static initViewListeners() {
    /**
     * @description OCE native event is the result of calling the CLMPlayer.getSurveyFlowJson() function.
     */
    window.CLMPlayer.registerEventListener('surveyflowjsonloaded', (flowjson) => {
      OceSurveyManager.surveyFlowJsonHandler(flowjson);
    });
    /**
     * @description OCE native event is triggered right before call opening.
     */
    window.CLMPlayer.registerEventListener('surveyflowjsonforcallloaded', () => {
      OceSurveyManager.surveyFlowJsonForCallHandler();
    });
    /**
     * @description OCE native event is triggered when a slide is opened.
     */
    window.CLMPlayer.registerEventListener('viewappearing', () => {
      document.dispatchEvent(new CustomEvent('viewappearing'));
      contentPreloader.showNodeContent(FusionApi.getRootNode());
      oceStorage.init();
      OceSurveyManager.initSurvey();
      OceStateManager.setInitialActiveStates();
      // track slide enter
      const { slide } = FusionStore.environmentData;
      oceMonitoring.trackSlideEnter({ id: slide.name });
    });
    /**
     * @description OCE native event is triggered when a slide is closed.
     */
    window.CLMPlayer.registerEventListener('viewdisappearing', () => {
      document.dispatchEvent(new CustomEvent('viewdisappearing'));
      contentPreloader.hideNodeContent(FusionApi.getRootNode());
      OceStateManager.resetActiveStates();
      // track slide exit
      const { slide } = FusionStore.environmentData;
      oceMonitoring.trackSlideExit({ id: slide.name });
    });
    /**
     * @description event for survey update.
     */
    document.addEventListener('updateSurvey', (e) => {
      OceSurveyManager.updateSurvey(e.detail);
    });
  }
}

const oceEventHandler = new OceEventHandler();

export { oceEventHandler };
