import config from '../../../package.json';

class VersionManager {
  static isValidVersion(version) {
    return /^\d+\.\d+\.\d+$/.test(version);
  }

  /**
   * @param {string} version
   * @returns {boolean|never}
   */
  static validateVersion(version) {
    const isValid = VersionManager.isValidVersion(version);
    if (!isValid) {
      throw new Error(`[ERR:Fusion:VersionManager] Invalid version ${version} provided in config. The version must be in format "x.x.x"`);
    }
    return isValid;
  }

  constructor(version) {
    this.version = version;
  }

  /**
   * @param {string} version
   * @returns {string[]}
   */
  static parseVersion(version) {
    return version.split('.');
  }

  /**
   * @param {string} version
   * @param {string} refVersion
   * @returns {number} - above => 1, below => -1, equal => 0
   */
  static compareVersions(version, refVersion) {
    const v1 = VersionManager.parseVersion(version);
    const v2 = VersionManager.parseVersion(refVersion);
    return v1.reduce((result, n, i) => {
      if (!result) {
        if (n > v2[i]) result = 1;
        else if (n < v2[i]) result = -1;
      }
      return result;
    }, 0);
  }

  isCurrentVersionAbove(version) {
    VersionManager.validateVersion(version);
    return VersionManager.compareVersions(this.version, version) === 1;
  }

  isCurrentVersionBelow(version) {
    VersionManager.validateVersion(version);
    return VersionManager.compareVersions(this.version, version) === -1;
  }

  getVersion() {
    return this.version;
  }
}

const versionManager = new VersionManager(config.version);

export { versionManager };
