import { versionManager } from './services/version-manager';

const isObject = (item) => (item && typeof item === 'object' && !Array.isArray(item));

const mergeObj = (target, source) => {
  let output = { ...target };
  Object.keys(source).forEach((key) => {
    if (isObject(source[key])) {
      if (!Object.prototype.hasOwnProperty.call(target, key)) {
        output = { ...output, [key]: source[key] };
      } else {
        output[key] = mergeObj(target[key], source[key]);
      }
    } else {
      output = { ...output, [key]: source[key] };
    }
  });
  return output;
};

const getPartial = (origin, keys) => keys.reduce((partial, key) => {
  partial[key] = origin[key];
  return partial;
}, {});

/**
 * @description Comparing Map entries with array and returning new Map with intersections
 * @param {Map<any, any>} changedProps
 * @param {Array<any>} keys
 * @returns {Map<any, any>}
 */
const intersectMap = (changedProps, keys) => new Map([...changedProps]
  .filter(([key]) => keys.includes(key)));

/**
 * debounce. Lodash function for skip a lot of trigger events
 * @param {function} cb Function that will be executed
 * @param {Number} time Delay on debounce
 * @return {function}
 */
const debounce = (cb, time = 300) => {
  let timer = 0;
  return ((...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      cb(...args);
    }, time);
  });
};

/**
 * @description color check
 * @param {string} rgbaString - color value
 * @returns {boolean}
 */
const isRgba = (rgbaString) => {
  const pattern = /rgba\((\d+,\s*){3}(\d(\.\d+)?)\)/g;
  return !!pattern.exec(rgbaString);
};

/**
 * @description check alpha color by calibrating
 * @param {string} rgbaString - color value
 * @param {number} calibration - value for the calibration
 * @returns {boolean}
 */
const isTransparentRgba = (rgbaString, calibration = 0) => (isRgba(rgbaString)
  ? parseFloat(rgbaString.split(',')[3]) <= calibration
  : !isRgba(rgbaString));

/**
 * @param {Object} obj
 * @param {function} cb function, that be applied for each obj key
 */
const applyToObject = (obj, cb) => {
  Object.keys(obj)
    .forEach((key) => {
      cb(key);
    });
};

/**
 * Transforms addEventListener to a Promise. Listener fires only once und unsubscribes itself
 * @param {HTMLElement} emitter
 * @param {string} eventName
 * @param {boolean} [skipTargetCheck=false]
 * @returns {Promise<object>} resolves to the event object
 */
const promisifyEvent = (emitter, eventName, skipTargetCheck = false) => new Promise((res) => {
  const listener = (e) => {
    if (skipTargetCheck || e.target === emitter) {
      emitter.removeEventListener(eventName, listener);
      res(e);
    }
  };
  emitter.addEventListener(eventName, listener);
});

const emitInitEvents = async (emitter, { name, props = {} }) => {
  // @fixme: 'rendered' bubbles up, as well as 'published' (MF)
  await promisifyEvent(emitter, 'rendered');
  emitter.emitCustomEvent(name, props);
};

const getValueObject = (value) => {
  if (value === undefined || value === '') {
    throw new Error(`Base: can't get number value from ${value}`);
  }
  const num = parseFloat(value);
  const finalNum = !Number.isNaN(num) ? num : '';
  const unit = typeof value === 'string' ? value.replace(/[^a-zA-Z/%]/g, '') : '';
  return {
    num: finalNum,
    unit,
  };
};

/**
 * @description Stop playing and reset the player to start position
 * @param {object} player
 */
const resetPlayer = (player) => {
  player.pause();
  player.currentTime = 0;
};

/**
 * @description Compile object from the localizations JSON files
 * @param {function} require.context() function of Webpack. Please see:
 * https://webpack.js.org/guides/dependency-management/#requirecontext
 * @returns {object} all merged localizations from predefined folders
 */
const compileObjectFromContext = (context) => {
  const regexp = /(^.\/)|(.json)/g;

  return context.keys().reduce((partial, locale) => {
    partial[locale.replace(regexp, '')] = context(locale);
    return partial;
  }, {});
};

/**
 * @typedef {object} ComponentEventsSetup
 * @property {function<FusionBase>} component
 * @property {object.<string, string>} customEvents - object of custom events
 * @property {object.<string, string>} events
 *
 */

/**
 * @description Create component events setup object
 * @param {function<FusionBase>} component
 * @param {object.<string, string>} customEvents - object of custom events
 * @returns {ComponentEventsSetup}
 */
const createObjectItem = (component, customEvents = {}) => {
  const { componentName } = component.options;
  return {
    component,
    name: componentName,
    events: {
      add: `${componentName}:added`,
      remove: `${componentName}:removed`,
      ...customEvents,
    },
  };
};

/**
 * @param {string} path
 * @param {string} [responseType='json']
 * @return {Promise<any>}
 */
const httpRequest = (path, { responseType = 'json' } = {}) => new Promise((res, rej) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', path, true);
  xhr.responseType = responseType;
  xhr.onload = () => {
    const { status } = xhr;
    // 0 is when read from fs (in CRM)
    if (status === 200 || status === 0) {
      res(xhr.response);
    } else {
      rej(xhr.response);
    }
  };
  xhr.onerror = (e) => {
    rej(e);
  };
  xhr.send();
});

/**
 * @param {HTMLElement} el
 * @return {boolean}
 */
const hasInactiveStatefulParent = (el) => {
  let result = false;
  while (el && el.parentNode) {
    if (el.parentNode.isStateful && !el.parentNode.active) {
      result = true;
      break;
    }
    el = el.parentNode;
  }
  return result;
};

const delay = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

const triggerEvent = (name, data) => {
  const event = new CustomEvent(name, { detail: data });
  document.dispatchEvent(event);
};

/**
 *
 * @param {HTMLElement} el
 * @param {Number} level
 */
const setLevelCallback = (el, level) => {
  const multiplier = el.constructor.options.baseLevel || 100;
  el.style.setProperty('--level', level * multiplier);
  el.level = level;
};

/**
 * @param {Node} element
 * @param {Function<FusionBase>} baseConstructor
 */
const triggerPublishedEventRecursively = (element, baseConstructor) => {
  if (element instanceof baseConstructor) {
    element.emitCustomEvent('published', { bubbles: false });
  }
  [...element.childNodes].forEach((el) => triggerPublishedEventRecursively(el, baseConstructor));
};

const isActivator = () => /activator|monarch|amazonaws/.test(document.location.hostname);

/**
 * @description Getting a default Boolean value depending on the version of the shared resource
 * @returns {boolean}
 */
const isReflectiveBoolean = () => {
  const comparisonVersion = '2.1.1';
  return !versionManager.isCurrentVersionAbove(comparisonVersion);
};

const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export {
  applyToObject,
  compileObjectFromContext,
  createObjectItem,
  debounce,
  delay,
  emitInitEvents,
  getPartial,
  getValueObject,
  hasInactiveStatefulParent,
  httpRequest,
  intersectMap,
  isActivator,
  isEqual,
  isReflectiveBoolean,
  isRgba,
  isTransparentRgba,
  mergeObj,
  promisifyEvent,
  resetPlayer,
  setLevelCallback,
  triggerEvent,
  triggerPublishedEventRecursively,
};
