const config = require('./oce.navigation-config.json');

const { navigationMap } = config;
const oceData = require('../oce.data-utils');

class OceNavigation {
  static get oceGoToConfig() {
    return {
      next: 'goToNext',
      previous: 'goToPrev',
      target: 'goTo',
    };
  }

  /**
   * @param {String} slide - activator slide name
   * @param {String} direction - direction (key from oceGoToConfig)
   * @param {Boolean} isDocId - type of navigation
   */
  static oceGoTo(slide, direction, isDocId) {
    const gotoFunc = this.oceGoToConfig[direction];
    if (gotoFunc) {
      const targetSlide = isDocId ? this.getSlideNameByDocId(slide, navigationMap) : slide;
      this[gotoFunc](targetSlide);
    }
  }

  /**
   * @param {String} docId - activator slide document id
   * @param {Object} navigationConfig - config with slide document ids and corresponding slide names
   */
  static getSlideNameByDocId(docId, navigationConfig) {
    let slideName;
    if (navigationConfig[docId]) {
      slideName = navigationConfig[docId];
    }
    return slideName;
  }

  /**
   * @param {String} slideName - activator slide name
   */
  static goTo(slideName) {
    if (oceData.constructor.isDeepPresentation()) {
      const oceSlideName = oceData.constructor.getOceSlideName(slideName);
      window.CLMPlayer.gotoSlide(null, oceSlideName);
    } else {
      const oceSlideId = oceData.constructor.getOceSlideExtId(slideName);
      window.CLMPlayer.gotoSlide(oceSlideId);
    }
  }

  static goToNext() {
    if (oceData.constructor.isDeepPresentation()) {
      const currSlideIndex = oceData.constructor.getCurrentSlideIndex();
      const nextSlide = oceData.constructor.getCurrentPresentationSlides()[currSlideIndex + 1];
      window.CLMPlayer.gotoSlide(null, nextSlide.name);
    } else {
      window.CLMPlayer.goNextSequence();
    }
  }

  static goToPrev() {
    if (oceData.constructor.isDeepPresentation()) {
      const currSlideIndex = oceData.constructor.getCurrentSlideIndex();
      const prevSlide = oceData.constructor.getCurrentPresentationSlides()[currSlideIndex - 1];
      window.CLMPlayer.gotoSlide(null, prevSlide.name);
    } else {
      window.CLMPlayer.goPreviousSequence();
    }
  }
}

module.exports = OceNavigation;
