/**
 * Fusion service for log to console
 * Should be singetone
 */

class FusionLogger {
  static get styles() {
    return {
      log: 'color: rgba(39,42,239,0.97); font-weight: bold; background-color: rgba(239,241,169,1);',
      warn: 'color: rgba(245,120,13,1); font-weight: bold; background-color: rgba(239,241,169,1);',
      err: 'color: red; font-weight: bold; background-color: rgba(239,241,169,1);',
    };
  }

  static getStyle(type) {
    return FusionLogger.styles[type];
  }

  static log(message, module) {
    const { fullMessage, style } = FusionLogger.generateMethodAndStyle(message, module, 'log');
    // eslint-disable-next-line
    console.log(fullMessage, style);
  }

  static warn(message, module) {
    const { fullMessage, style } = FusionLogger.generateMethodAndStyle(message, module, 'warn');
    // eslint-disable-next-line
    console.warn(fullMessage, style);
  }

  static error(message, module) {
    const { fullMessage, style } = FusionLogger.generateMethodAndStyle(message, module, 'err');
    // eslint-disable-next-line
    console.error(fullMessage, style);
  }

  static generateMethodAndStyle(message, module, type) {
    const style = FusionLogger.getStyle(type);
    return {
      fullMessage: `%c [${type.toUpperCase()}:${module}:FUSION] ${message}`,
      style,
    };
  }
}

export { FusionLogger };
