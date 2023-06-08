// @note: need to solve the problem with unnecessary imports
import { veevaData } from '../veeva-data';
import { FusionStore } from './fusion-store';
import { FusionLogger } from './fusion-logger';
import { setEnvironmentData } from '../_actions/environment-data';
import { FusionApi } from '../api';
import { getBinder, getSlide } from './environment-data';

let OceDataReceiver = null;
if (process.env.BUILD_MODE === 'prod') {
  // eslint-disable-next-line global-require
  OceDataReceiver = require('../oce/oce.data-receiver');
}

class VeevaDataReceiver {
  static get env() {
    return 'veeva';
  }

  /**
   * Environment data object
   * @typedef {Object} EnvironmentData
   * @property {Object|null} binder - binder data (structure depends of env)
   * @property {Array[]} slides - binder slides (structure depends of env)
   * @property {Object|null} slide - slide data (structure depends of env)
   */

  /**
   * @returns {EnvironmentData}
   */
  static async getData() {
    let data = { binder: null, slides: [], slide: null };
    try {
      const keyMessageId = await veevaData.getCurrentKeyMessageId();
      const slide = await veevaData.getKeyMessageData(keyMessageId);
      const presentationId = await veevaData.getCurrentPresentationId();
      const binder = await veevaData.getPresentationData(presentationId);
      const slidesArr = await veevaData.getCurrentPresentationSlides(presentationId);
      const slides = await this.getKeyMessageInfo(slidesArr, [], 0);
      data = { binder: binder.shift(), slides, slide: slide.shift() };
    } catch (err) {
      FusionLogger.error(`${err}`, 'EnvDataReceiver');
    }
    return data;
  }

  static async getKeyMessageInfo(slidesArr, slides, index) {
    if (slidesArr[index]) {
      const data = await veevaData.getKeyMessageData(slidesArr[index].Key_Message_vod__c);
      slides.push(data.shift());
      index += 1;
      return this.getKeyMessageInfo(slidesArr, slides, index);
    }
    return slides;
  }
}

function getBinderSlides(binder) {
  return binder.documents.map(({ properties }) => ({
    id: properties.document_id__v,
    name__v: properties.name__v,
  }));
}

function isSlideBinder(binder, document) {
  return binder.documents
    && binder.documents.some((slide) => slide.properties.document_id__v === document.id);
}

function getNestedSlides(binder, document) {
  return binder && isSlideBinder(binder, document) ? getBinderSlides(binder) : [];
}

class ActivatorDataReceiver {
  static get env() {
    return 'activator';
  }

  /**
   * @returns {EnvironmentData}
   */
  static async getData() {
    const { document, binder = null } = await FusionApi.request({
      name: 'actions/setNavigationBinderData',
    });
    return { binder, slides: getNestedSlides(binder, document), slide: document };
  }
}

/**
 * @typedef {object} SlideScreenShotServiceEnvData
 * @property {string} id - Vault document ID
 * @property {string} name__v
 */

/**
 * @typedef {object} BinderScreenShotServiceEnvData
 * @property {string} id - Vault document ID
 * @property {string} name__v
 * @property {string} crm_presentation_id__v
 * @property {object[]} documents - info about nested slides, as we receive from Vault
 */

/**
 * @typedef {object} ScreenShotServiceEnvData
 * @property {SlideScreenShotServiceEnvData} slide - includes fields, which we GET from Vault, like if, name__v etc
 * @property {BinderScreenShotServiceEnvData} binder - includes fields, which we GET from Vault, BUT
 */

class SreenShotDataReceiver {
  static get env() {
    return 'screenshot';
  }

  /**
   * @returns {EnvironmentData}
   */
  static async getData() {
    const { slide, binder = null } = JSON.parse(window.SShotEnvironmentData);
    return { binder, slides: getNestedSlides(binder, slide), slide };
  }
}

class EnvDataReceiver {
  static init() {
    // Roman S explanation: Env load faster than subscribtion works. e carefully
    const env = FusionStore.store.getState().app.environment;
    if (env !== '') {
      this.initReceiver();
    }
    document.addEventListener('EnvironmentDetector:environmentDetected', () => this.initReceiver());
  }

  static async initReceiver() {
    const receiver = this.getReceiver();
    if (receiver) {
      const { binder, slides, slide } = await receiver.constructor.getData();
      const binderData = getBinder(binder, slides, receiver.constructor.env);
      const slideData = getSlide(slide, receiver.constructor.env);
      const data = {
        binder: binderData,
        slide: slideData,
      };
      FusionStore.store.dispatch(setEnvironmentData(data));
      document.dispatchEvent(new CustomEvent('EnvironmentDataReceived', { detail: data }));
    } else {
      FusionLogger.warn(`Missed data receiver for environment: ${FusionStore.environment}`, 'EnvDataReceiver');
    }
  }

  static getReceiver() {
    let receiver = null;
    if (FusionStore.isVeeva) {
      receiver = new VeevaDataReceiver();
    }
    if (FusionStore.isActivator) {
      receiver = new ActivatorDataReceiver();
    }
    if (FusionStore.isScreenShot) {
      receiver = new SreenShotDataReceiver();
    }
    if (FusionStore.isOce) {
      receiver = new OceDataReceiver();
    }
    return receiver;
  }
}
export { EnvDataReceiver };
