class ClickStream {
  /**
   * @param {MonitoringItem} data
   */
  constructor(data) {
    this.setId();
    this.setDefaultFields(data);
    this.setCustomFields(data);
  }

  /**
   * @param {MonitoringItem} data
   */
  setDefaultFields(data) {
    const {
      trackId, type, description, answer,
    } = data;
    this.Track_Element_Id_vod__c = trackId;
    this.Track_Element_Type_vod__c = type;
    this.Track_Element_Description_vod__c = description;
    this.Answer_vod__c = answer;
  }

  /**
   * @param {MonitoringItem} data
   */
  setCustomFields(data) {
    this.setDuration(data);
    this.setInsight(data);
  }

  setDuration(data) {
    const { trackUsageDuration, ticksToSubmit } = data;
    if (trackUsageDuration) {
      this.Usage_Duration_vod__c = ticksToSubmit;
    }
  }

  setId(value = '') {
    this.ID = value;
  }

  setInsight(data) {
    const { type } = data;
    if (type === 'insight') {
      this.CLM_Insight__c = 1;
    }
  }

  setAnswer(data) {
    const answer = data.answer ?? '';
    this.Answer_vod__c = answer.toString();
  }
}

export { ClickStream };
