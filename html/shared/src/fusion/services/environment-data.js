const DATA_FIELDS_CONFIG = {
  binder: {
    docId: {
      veeva: 'Vault_Doc_Id_vod__c',
      activator: 'id',
      screenshot: 'id',
      oce: '',
    },
    name: {
      veeva: 'Name',
      activator: 'name__v',
      screenshot: 'name__v',
      oce: 'name',
    },
    id: {
      veeva: 'Presentation_Id_vod__c',
      activator: 'crm_presentation_id__v',
      screenshot: 'crm_presentation_id__v',
      oce: '',
    },
    path: {
      veeva: 'Vault_External_Id_vod__c',
      activator: '',
      screenshot: '',
      oce: '',
    },
  },
  slide: {
    docId: {
      veeva: 'Vault_Doc_Id_vod__c',
      activator: 'id',
      screenshot: 'id',
      oce: '',
    },
    name: {
      veeva: 'Name',
      activator: 'name__v',
      screenshot: 'name__v',
      oce: 'name',
    },
  },
};

/**
 * Slide object
 * @typedef {Object} Slide
 * @property {Number} docId - vault document id
 * @property {String} name - name of slide
 */
/**
 * Binder object
 * @typedef {Object} Binder
 * @property {Number} docId - vault document id
 * @property {String} name - name of binder
 * @property {String} id - presentation id
 * @property {String} path - vault full path to binder
 * @property {Slide[]} slides
 */
/**
 * @param {Object} slideData - slide obj (structure depends of env).
 * @param {string} env - environment.
 * @returns {Slide|null}
 */

const getSlide = (slideData, env) => {
  let slide = null;
  if (slideData) {
    slide = Object.keys(DATA_FIELDS_CONFIG.slide).reduce((obj, key) => {
      obj[key] = slideData[DATA_FIELDS_CONFIG.slide[key][env]];
      return obj;
    }, {});
  }
  return slide;
};

const setBinderSlides = (slidesData, env) => slidesData.map((slideData) => getSlide(slideData, env));
/**
 * @param {Object} binderData - binder obj (structure depends of env).
 * @param {Array} slidesData - binder slides array.
 * @param {string} env - environment.
 * @returns {Binder|null}
 */
const getBinder = (binderData, slidesData, env) => {
  let binder = null;
  if (binderData) {
    binder = Object.keys(DATA_FIELDS_CONFIG.binder).reduce((obj, key) => {
      obj[key] = binderData[DATA_FIELDS_CONFIG.binder[key][env]];
      return obj;
    }, {});
    binder.slides = setBinderSlides(slidesData, env);
  }
  return binder;
};

export {
  getBinder, getSlide,
};
