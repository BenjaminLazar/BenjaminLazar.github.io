class VeevaData {
  /**
   * @typedef {Object} ObjData
   * @property {String} obj - salesforce obj key
   * @property {Array[]} field - requested object fields
   * @property {String} where - condition for objects filter
   */

  /**
   * @typedef {Object} RequestData
   * @property {ObjData} objData
   * @property {String} data - data for filter condition
   * @property {Object} result - result data from previous request
   * @property {*} resolve - promise resolve
   * @property {*} reject - promise reject
   */
  constructor() {
    this.objConfig = {
      Presentation: {
        obj: 'Presentation',
        field: ['ID'],
      },
      KeyMessage: {
        obj: 'KeyMessage',
        field: ['ID'],
      },
      Key_Message_vod__c: {
        obj: 'Key_Message_vod__c',
        field: ['ID', 'Name', 'Vault_Doc_Id_vod__c'],
        where: (data) => (data ? `WHERE ID ='${data}'` : ''),
      },
      Clm_Presentation_vod__c: {
        obj: 'Clm_Presentation_vod__c',
        field: ['ID', 'Name', 'Vault_External_Id_vod__c', 'Presentation_Id_vod__c', 'Vault_Doc_Id_vod__c'],
        where: (data) => (data ? `WHERE ID ='${data}'` : ''),
      },
      Clm_Presentation_Slide_vod__c: {
        obj: 'Clm_Presentation_Slide_vod__c',
        field: ['ID', 'Clm_Presentation_vod__c', 'Name', 'Key_Message_vod__c'],
        where: (data) => (data ? `WHERE Clm_Presentation_vod__c ='${data}'` : ''),
      },
    };
  }

  getDataForCurrentObject(obj, field) {
    const objData = this.objConfig[obj];
    return new Promise((resolve, reject) => {
      window.com.veeva.clm.getDataForCurrentObject(objData.obj, field, (result) => {
        if (result.success) {
          resolve(result[objData.obj][field]);
        } else {
          reject(result.message);
        }
      });
    });
  }

  static clearInvalidFields(fields, { message }) {
    return fields.filter((item) => !message.includes(item));
  }

  /**
   * @param {RequestData} requestData
   */
  handleQueryError(requestData) {
    const {
      objData,
      data,
      result,
      resolve,
      reject,
    } = requestData;
    const { obj, where } = objData;
    let { field } = objData;
    field = this.constructor.clearInvalidFields(field, result);
    if (field.length) {
      window.com.veeva.clm.queryRecord(obj, field, where(data), [], '', (res) => {
        if (res.success) {
          resolve(res[obj]);
        } else {
          this.handleQueryError(requestData);
        }
      });
    } else {
      reject(`All requested fields are not available in object: ${obj}`);
    }
  }

  /**
   * @param {Object} objKey - key of the requested salesforce object
   * @param {Object} data - condition for objects filter
   * @returns {Promise} Promise object represents the result of the request
   */
  queryRecord(objKey, data) {
    const objData = this.objConfig[objKey];
    return new Promise((resolve, reject) => {
      const { obj, field, where } = objData;
      window.com.veeva.clm.queryRecord(obj, field, where(data), [], '', (result) => {
        if (result.success) {
          resolve(result[obj]);
        } else {
          const requestData = {
            objData,
            data,
            result,
            resolve,
            reject,
          };
          this.handleQueryError(requestData);
        }
      });
    });
  }

  getCurrentPresentationId() {
    return this.getDataForCurrentObject('Presentation', 'ID');
  }

  getCurrentKeyMessageId() {
    return this.getDataForCurrentObject('KeyMessage', 'ID');
  }

  getCurrentPresentationSlides(Id) {
    return this.queryRecord('Clm_Presentation_Slide_vod__c', Id);
  }

  getKeyMessageData(Id) {
    return this.queryRecord('Key_Message_vod__c', Id);
  }

  getPresentationData(Id) {
    return this.queryRecord('Clm_Presentation_vod__c', Id);
  }
}

const veevaData = new VeevaData();
export { veevaData };
