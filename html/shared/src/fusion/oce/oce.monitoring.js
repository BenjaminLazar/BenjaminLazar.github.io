// eslint-disable-next-line max-classes-per-file
import { FusionLogger } from '../services/fusion-logger';
import { analyticsData } from '../../data/analytics.json';

const CONFIG = {
  types: {
    slide: 'slide',
    popup: 'popup',
    pdf: 'pdf',
    custom: 'custom',
  },
};

/*
OCEMonitoringItem:
    input: data = {id, type ....}
    publicMethods:
      enter() - run on view appear
      exit() - run on view disappear

*/
/* eslint-disable class-methods-use-this */
class OCEMonitoringItem {
  constructor(data) {
    this.init(data);
  }

  init(data) {
    this.itemData = OCEMonitoringItem.initData(data);
  }

  static initData(data) {
    const {
      itemId, id, type, description, answer,
    } = data;
    return {
      id: itemId,
      trackId: id,
      description,
      type,
      answer,
    };
  }

  enter() {
    const { trackId } = this.itemData;
    // Start tracking a new ClickStreamMetric__c with the field PageId__c set to the parameter pageid (accepts any string).
    // The method can be used to create additional clickstream within one slide with the arbitrary string as pageid.
    window.CLMPlayer.startTrackingPage(trackId);
  }

  exit() {
    // Stops tracking statistics for the current slide.
    // This method can be used to stop additional clickstream within one slide with arbitrary string as pageid.
    window.CLMPlayer.stopTrackingPage();
  }
}

export class OCEMonitoring {
  constructor() {
    this.INPUT_DATA = {
      id: 'id',
      type: Object.values(CONFIG.types),
      description: 'description',
      answer: 'answer',
    };
    this.analyticData = analyticsData;
    this.monitoringItems = {};
  }

  trackSlideEnter(data) {
    this.doItemAction(OCEMonitoring.trackItemEnter, data);
  }

  trackSlideExit(data) {
    this.doItemAction(OCEMonitoring.trackItemExit, data);
  }

  getMonitoringItem(data) {
    const itemData = this.createItemData(data);
    let result = null;
    if (itemData) {
      result = this.monitoringItems[itemData.itemId] || (this.monitoringItems[itemData.itemId] = new OCEMonitoringItem(itemData));
    }
    return result;
  }

  doItemAction(action, data) {
    const item = this.getMonitoringItem(data);
    if (item) {
      action.call(this, item, data);
    }
  }

  static trackItemEnter(item, data, time) {
    item.enter(time);
  }

  static trackItemExit(item) {
    item.exit();
  }

  formatInputData(data) {
    const obj = {};
    Object.keys(data)
      .filter((key) => this.INPUT_DATA[key])
      .forEach((key) => {
        obj[key] = data[key];
        return obj;
      });
    return obj;
  }

  isTypeExist(type) {
    return this.INPUT_DATA.type.includes(type);
  }

  isValidFields(data) {
    const { id, type, description } = data;
    const isValidType = type && this.isTypeExist(type);
    const isValidFields = id && description;
    return isValidType && isValidFields;
  }

  createItemData(data) {
    const fileData = this.getFileItem(data);
    let inputData = null;
    if (fileData) {
      if (this.isValidFields(fileData)) {
        inputData = this.formatInputData(fileData);
        inputData.itemId = data.id;
      } else {
        FusionLogger.error(`Invalid monitoring data for item: ${data.id}`, 'OCEMonitoring');
      }
    } else {
      FusionLogger.warn(`Missed monitoring data in analytics.json for item: ${data.id}`, 'OCEMonitoring');
    }
    return inputData;
  }

  static filterCondition(itemId, keyId) {
    return itemId === keyId;
  }

  getFileItem(data) {
    const item = Object.keys(this.analyticData)
      .find((key) => OCEMonitoring.filterCondition(data.id, key));
    return this.analyticData[item];
  }
}

const oceMonitoring = new OCEMonitoring();

export { oceMonitoring };
