import { FusionStore } from './services/fusion-store';
import { FusionLogger } from './services/fusion-logger';

const PATH_SEPARATOR = '::';
const FILE_TYPE = '.zip';
let OceNavigation = null;
if (process.env.BUILD_MODE === 'prod') {
  // eslint-disable-next-line global-require
  OceNavigation = require('./oce/navigation/oce.navigation');
}

class FusionNavigation {
  static get veevaGoToConfig() {
    return {
      next: 'veevaGoToNext',
      previous: 'veevaGoToPrev',
      target: 'veevaGoToTarget',
    };
  }

  static isValidInput(slide, direction) {
    return direction !== 'target' || !!slide;
  }

  static isActivatorGoTo(isActivator, isEditMode) {
    return isActivator && !isEditMode;
  }

  static navigate(slide, presentation, direction, isDocId) {
    if (FusionNavigation.isActivatorGoTo(FusionStore.isActivator, FusionStore.isEditMode)) {
      return FusionNavigation.activatorGoTo(slide, presentation, direction, isDocId);
    }
    if (FusionStore.isVeeva) {
      FusionNavigation.veevaGoTo(slide, presentation, direction, isDocId);
    }
    if (process.env.BUILD_MODE === 'prod' && FusionStore.isOce) {
      FusionNavigation.oceGoTo(slide, direction, isDocId);
    }
    return null;
  }

  /**
   * @description Navigation to another slide/binder in Activator and Veeva.
   * @param {(string|number)} slide - slideName|slideDocId - target navigation slide.
   * @param {(string|number)} presentation - presentationId|presentationDocId - target navigation presentation.
   * @param {string} direction - target navigation direction (see FusionNavigation.veevaGoToConfig.keys).
   * @param {Boolean} isDocId - is navigation by document ids.
   */
  static goTo(slide, presentation, direction = 'target', isDocId = false) {
    if (FusionNavigation.isValidInput(slide, direction)) {
      return FusionNavigation.navigate(slide, presentation, direction, isDocId);
    }
    return FusionLogger.error(`Invalid target slide: ${slide}`, 'FusionNavigation');
  }

  static activatorGoTo(slide, presentation, direction, isDocId) {
    return {
      name: 'actions/activatorGoTo',
      data: {
        slide, presentation, direction, isDocId,
      },
    };
  }

  static getExtId(path, docId) {
    return path + PATH_SEPARATOR + docId;
  }

  static oceGoTo(slide, direction, isDocId) {
    OceNavigation.oceGoTo(slide, direction, isDocId);
  }

  static veevaGoTo(slide, presentation, direction, isDocId) {
    const gotoFunc = FusionNavigation.veevaGoToConfig[direction];
    if (gotoFunc) {
      FusionNavigation[gotoFunc](slide, presentation, isDocId);
    } else {
      FusionLogger.error(`wrong veevaGoTo direction: ${direction}`, 'FusionNavigation');
    }
  }

  static getMediaFileName(slideName) {
    return slideName + FILE_TYPE;
  }

  static docIdNavigation(slide, presentation) {
    const path = this.vaultPath;
    const slideExtId = FusionNavigation.getExtId(path, slide);
    const presentationExtId = presentation ? FusionNavigation.getExtId(path, presentation) : '';
    window.com.veeva.clm.gotoSlideV2(slideExtId, presentationExtId);
  }

  static veevaGoToTarget(slide, presentation = '', isDocId) {
    if (isDocId) {
      FusionNavigation.docIdNavigation(slide, presentation);
    } else {
      const mediaFileName = FusionNavigation.getMediaFileName(slide);
      window.com.veeva.clm.gotoSlide(mediaFileName, presentation);
    }
  }

  static veevaGoToNext() {
    return window.com.veeva.clm.nextSlide();
  }

  static veevaGoToPrev() {
    return window.com.veeva.clm.prevSlide();
  }

  static get vaultPath() {
    const extId = FusionStore.binder.path;
    return extId.split(PATH_SEPARATOR).shift();
  }
}

export { FusionNavigation };
