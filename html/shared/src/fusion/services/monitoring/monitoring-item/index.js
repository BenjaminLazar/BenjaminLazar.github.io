import { ClickStream } from './clickstream';
import { triggerEvent } from '../../../utils';

const CLICKSTREAM_OBJECT_NAME = 'Call_Clickstream_vod__c';
const TICKS_PER_MS = 10000;

class MonitoringItem {
  /**
   * Data from analytics.json with own identifier
   * @typedef {Object} MonitoringItemInput
   * @property {String} id - item data for 'Track_Element_Id_vod__c' clickStream field
   * @property {String} itemId - inner unique item identifier
   * @property {String} description - item data for 'Track_Element_Description_vod__c' clickStream field
   * @property {String} type - item data for 'Track_Element_Type_vod__c' clickStream field
   */

  /**
   * Data from analytics.json with additional fields for calculations
   * @typedef {Object} MonitoringItem
   * @property {String} id - inner unique item identifier
   * @property {String} trackId -  item data for 'Track_Element_Id_vod__c' clickStream field
   * @property {String} description - item data for 'Track_Element_Description_vod__c' clickStream field
   * @property {String} type - item data for 'Track_Element_Type_vod__c' clickStream field
   * @property {String} answer - item data for 'Answer_vod__c' clickStream field
   * @property {Date} startTime - item start tracking time
   * @property {Date} duration - item visit duration
   * @property {Date} endTime - item end tracking time
   * @property {Number} ticks - converted duration data for current visit
   * @property {Number} totalTicks - converted total duration for all visits
   * @property {Number} ticksToSubmit - computed value for 'Usage_Duration_vod__c' clickStream field based on isTotalTicks config
   * @property {Boolean} trackDuration - flag for tracking usage duration
   */

  /**
   * @typedef {Object} StackRunnerData
   * @property {String} id - inner unique item identifier
   * @property {String} description - item data for 'Track_Element_Description_vod__c' clickStream field
   * @property {String} type - item data for 'Track_Element_Type_vod__c' clickStream field
   * @property {Function} method - cd to be called for submit veeva data
   */

  /**
   * @param {MonitoringItemInput} data
   * @param {Object} params - additional possible input params
   */
  constructor(data, params = { isTotalTicks: false }) {
    const { isTotalTicks } = params;
    this.config = {
      isTotalTicks,
    };
    this.init(data);
  }

  /**
   * @param {MonitoringItem} data
   */
  static getClickStream(data) {
    return new ClickStream(data);
  }

  /**
   * @param {MonitoringItemInput} data
   */
  init(data) {
    this.itemData = this.constructor.initData(data);
    this.clickStream = this.constructor.getClickStream(this.itemData);
  }

  /**
   * @param {MonitoringItemInput} data
   * @returns {MonitoringItem}
   */
  static initData(data) {
    const {
      itemId, id, type, description, answer, trackUsageDuration,
    } = data;
    return {
      id: itemId,
      trackId: id,
      description,
      type,
      answer,
      startTime: new Date(),
      endTime: new Date(),
      duration: new Date(),
      ticks: 0,
      totalTicks: 0,
      ticksToSubmit: 0,
      trackUsageDuration,
    };
  }

  /**
   * @returns {StackRunnerData}
   */
  createQueryData() {
    const { id, type, description } = this.itemData;
    return {
      id,
      type,
      description,
      method: this.getQueryMethod(),
    };
  }

  getQueryMethod() {
    const { ID, ...objToSubmit } = this.clickStream;
    if (ID) {
      return (result) => window.com.veeva.clm.updateRecord(CLICKSTREAM_OBJECT_NAME, ID, objToSubmit, result);
    }
    return (result) => window.com.veeva.clm.createRecord(CLICKSTREAM_OBJECT_NAME, objToSubmit, result);
  }

  setStartTime(time = new Date()) {
    this.itemData.startTime = time;
  }

  calcDuration() {
    return this.itemData.endTime - this.itemData.startTime;
  }

  getDurationTime(storedTime = 0) {
    return this.calcDuration() + storedTime;
  }

  calcTicks() {
    return parseInt(this.itemData.duration * TICKS_PER_MS, 10);
  }

  /**
   * @param {VeevaResponse} result - data which returns veeva query
   */
  setClickStreamId(result) {
    const { ID } = result[CLICKSTREAM_OBJECT_NAME];
    if (!this.clickStream.ID) {
      this.clickStream.setId(ID);
    }
  }

  setSpentTime(time) {
    this.itemData.endTime = new Date();
    this.itemData.duration = this.getDurationTime(time);
    this.itemData.ticks = this.calcTicks();
    this.itemData.totalTicks += this.itemData.ticks;
    this.itemData.ticksToSubmit = this.getTicksToSubmit();
    this.clickStream.setDuration(this.itemData);
  }

  /**
   * @param {AnalyticJsonItem} data
   */
  updateDataAnswer(data) {
    const currentAnswer = data.answer;
    if (this.itemData.answer !== currentAnswer) {
      this.itemData.answer = currentAnswer;
      this.clickStream.setAnswer(this.itemData);
    }
  }

  getTicksToSubmit() {
    const { totalTicks, ticks } = this.itemData;
    return this.config.isTotalTicks ? totalTicks : ticks;
  }

  enter(time) {
    this.setStartTime(time);
    this.submit();
  }

  exit(time) {
    this.setSpentTime(time);
    this.submit();
  }

  submit() {
    triggerEvent('monitoring:query-ready', this.createQueryData());
  }
}

export { MonitoringItem };
