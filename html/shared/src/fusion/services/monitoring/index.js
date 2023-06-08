import { StackRunner } from './stack-runner';
import { FusionStore } from '../fusion-store';
import { FusionLogger } from '../fusion-logger';
import { MonitoringItem } from './monitoring-item';
import config from '../../../config.json';
import analytics from '../../../data/analytics.json';
import { triggerEvent } from '../../utils';

const CLICKSTREAM_OBJECT_NAME = 'Call_Clickstream_vod__c';
const STATE_SEPARATOR = '-';

class VeevaMonitoring {
  /**
   * Data from analytics.json
   * @typedef {Object} AnalyticJsonItem
   * @property {String} id - required item data for 'Track_Element_Id_vod__c' clickStream field
   * @property {String} [description] - required item data for 'Track_Element_Description_vod__c' clickStream field
   * @property {String} [type] - item data for 'Track_Element_Type_vod__c' clickStream field
   */

  /**
   * @typedef {object} CustomEvent
   */
  constructor() {
    if (VeevaMonitoring.instance) {
      return VeevaMonitoring.instance;
    }
    VeevaMonitoring.instance = this;
    this.analyticsData = analytics.analyticsData;
    this.stack = new StackRunner({ handler: VeevaMonitoring.queryHandler });
    this.monitoringItems = {};

    this.initListeners();
  }

  static get inputDataKeys() {
    return ['id', 'type', 'description', 'answer'];
  }

  static get inputDataTypeValues() {
    const { types } = config.veevaMonitoring;
    return types;
  }

  static get excludedDataTypeValues() {
    const { excludedTypes } = config.veevaMonitoring;
    return excludedTypes;
  }

  static get keyMessageName() {
    const { name } = FusionStore.slide;
    return name;
  }

  /**
   * This is 'gate' for extending VeevaMonitoring class. This function should be called by user with extended class before 'DOMContentLoaded' event.
   * After 'DOMContentLoaded' event this method will be called with default 'VeevaMonitoring' class in case it was not calle before with user class.
   */
  static createInstance(Class = VeevaMonitoring) {
    return new Class();
  }

  initListeners() {
    document.addEventListener('monitoring:query-completed', this.setSubmittedClickStreamId.bind(this));
    document.addEventListener('monitoring:query-ready', this.pushToStack.bind(this));
    document.addEventListener('EnvironmentDataReceived', this.trackKeyMessageEnter.bind(this));
    this.setVeevaExtends();
  }

  trackKeyMessageEnter() {
    this.trackSlideEnter({ id: this.constructor.keyMessageName });
  }

  setVeevaExtends() {
    if (window.com?.veeva) window.com.veeva.clm.createRecordsOnExit = () => this.presentationExit();
  }

  /**
   * @param {CustomEvent} data
   */
  setSubmittedClickStreamId(data) {
    this.doItemAction(this.constructor.setItemClickStreamId, data.detail);
  }

  /**
   * @param {AnalyticJsonItem} data
   */
  static trackSlideEnter(data) {
    VeevaMonitoring.instance?.trackSlideEnter(data);
  }

  trackSlideEnter(data) {
    const obj = { ...data, ...{ trackUsageDuration: true } };
    this.doItemAction(this.constructor.trackItemEnter, obj);
  }

  /**
   * @param {AnalyticJsonItem} data
   */
  static trackSlideExit(data) {
    VeevaMonitoring.instance?.trackSlideExit(data);
  }

  trackSlideExit(data) {
    this.doItemAction(this.constructor.trackItemExit, data);
  }

  /**
   * @param {AnalyticJsonItem} data
   */
  static trackCustomData(data) {
    VeevaMonitoring.instance?.trackCustomData(data);
  }

  trackCustomData(data) {
    this.doItemAction(this.constructor.trackItemCustomData, data);
  }

  static queryHandler(result, item) {
    const { id, type, description } = item;
    if (result.success === false) {
      FusionLogger.error(`${result.message}`, 'VeevaMonitoring');
    } else {
      triggerEvent('monitoring:query-completed', {
        id, type, description, result,
      });
    }
  }

  /**
   * @param {MonitoringItemInput} itemData
   */
  static generateMonitoringItem(itemData) {
    return new MonitoringItem(itemData);
  }

  createMonitoringItem(id, itemData) {
    this.monitoringItems[id] = this.constructor.generateMonitoringItem(itemData);
    return this.monitoringItems[id];
  }

  /**
   * @param {AnalyticJsonItem} data
   * @returns {MonitoringItem|null}
   */
  getMonitoringItem(data) {
    const itemData = this.createItemData(data);
    let item = null;
    if (itemData) {
      const id = itemData.itemId;
      item = this.monitoringItems[id] || this.createMonitoringItem(id, itemData);
    }
    return item;
  }

  /**
   * @param {Function} action
   * @param {AnalyticJsonItem} data
   */
  doItemAction(action, data) {
    const item = this.getMonitoringItem(data);
    if (item) {
      action(item, data);
    }
  }

  /**
   * @param {StackRunnerData} item
   * @param {VeevaResponse} data
   */
  static setItemClickStreamId(item, data) {
    item.setClickStreamId(data.result);
  }

  /**
   * @param {MonitoringItem} item
   * @param {AnalyticJsonItem} data
   * @param {Date} time
   */
  static trackItemEnter(item, data, time) {
    item.enter(time);
  }

  /**
   * @param {MonitoringItem} item
   */
  static trackItemExit(item) {
    item.exit();
  }

  /**
   * @param {MonitoringItem} item
   * @param {AnalyticJsonItem} data
   */
  static trackItemCustomData(item, data) {
    item.updateDataAnswer(data);
    item.submit();
  }

  /**
   * @param {AnalyticJsonItem} data
   * @returns {Object} trimmed data
   */
  static trimInputData(data) {
    return Object.keys(data)
      .filter((key) => this.inputDataKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});
  }

  // eslint-disable-next-line consistent-return
  static isTypeExist(type) {
    if (this.inputDataTypeValues) {
      return this.inputDataTypeValues.includes(type);
    }
    FusionLogger.error('Missed "types" key in "veevaMonitoring" object in "config.json"', 'VeevaMonitoring');
  }

  static isValidType(type) {
    const isValid = type && this.isTypeExist(type);
    if (!isValid) {
      FusionLogger.error(`Invalid or missed monitoring field "type": ${type}`, 'VeevaMonitoring');
    }
    return isValid;
  }

  static isRequiredFieldsExist(id, description) {
    const isValid = id && description;
    if (!isValid) {
      FusionLogger.error('Missed required monitoring fields "id","description"', 'VeevaMonitoring');
    }
    return isValid;
  }

  /**
   * @param {AnalyticJsonItem} data
   */
  static isValidFields(data) {
    const { id, type, description } = data;
    return this.isValidType(type) && this.isRequiredFieldsExist(id, description);
  }

  /**
   * @param {AnalyticJsonItem} data
   * @returns {MonitoringItemInput|null}
   */
  createItemData(data) {
    const fileData = this.getFileItem(data);
    let inputData = null;
    if (fileData) {
      if (this.constructor.isValidFields(fileData)) {
        inputData = this.constructor.trimInputData(fileData);
        inputData.itemId = data.id;
        inputData.trackUsageDuration = !!data.trackUsageDuration;
      } else {
        FusionLogger.error(`Invalid monitoring data for item: ${data.id}`, 'VeevaMonitoring');
      }
    } else {
      FusionLogger.warn(`Missed monitoring data in analytics.json for item: ${data.id}`, 'VeevaMonitoring');
    }
    return inputData;
  }

  /**
   * @param {AnalyticJsonItem} data
   * @returns {MonitoringItem}
   */
  getFileItem(data) {
    return this.analyticsData[data.id];
  }

  isExcluded(id) {
    const { type } = this.monitoringItems[id].itemData;
    return this.constructor.excludedDataTypeValues.includes(type);
  }

  isSubmitEnable(slideId) {
    return window.com && !this.isExcluded(slideId);
  }

  /**
   * @param {CustomEvent} queryData
   */
  pushToStack(queryData) {
    const data = queryData.detail;
    if (!FusionStore.isVeeva && !this.isExcluded(data.id)) {
      FusionLogger.log(`ClickStream to submit: ${JSON.stringify(this.monitoringItems[data.id].clickStream)}`, 'VeevaMonitoring');
    }
    if (this.isSubmitEnable(data.id)) {
      this.stack.push(data);
    }
  }

  static getActiveStates() {
    return FusionStore.store.getState().app.currentState;
  }

  static mapActiveStates() {
    return this.getActiveStates().map((state) => ({ id: state.split(STATE_SEPARATOR).pop() }));
  }

  presentationExit() {
    const itemsToSubmit = [{ id: this.constructor.keyMessageName }, ...this.constructor.mapActiveStates()];
    const objFieldsArray = [];
    const recordIdArray = [];
    const objNamesArray = [];
    itemsToSubmit.forEach((data) => {
      const monitoringItem = this.getMonitoringItem(data);
      if (monitoringItem) {
        const { id } = monitoringItem.itemData;
        if (this.isSubmitEnable(id)) {
          monitoringItem.setSpentTime();
          const { ID, ...objToSubmit } = monitoringItem.clickStream;
          objNamesArray.push(CLICKSTREAM_OBJECT_NAME);
          objFieldsArray.push(objToSubmit);
          recordIdArray.push(ID);
        }
      }
    });
    return window.com.veeva.clm.formatUpdateRecords(objNamesArray, recordIdArray, objFieldsArray);
  }
}
export { VeevaMonitoring };
