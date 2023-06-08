const oceData = require('./oce.data-utils');

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
   */
  static oceGoTo(slide, direction) {
    const gotoFunc = this.oceGoToConfig[direction];
    if (gotoFunc) {
      this[gotoFunc](slide);
    }
  }

  /**
   * @param {String} slideName - activator slide name
   */
  static goTo(slideName) {
    if (oceData.constructor.isDeepPresentation()) {
      const oceSlideName = oceData.constructor.getOceSlideName(slideName);
      window.CLMPlayer.gotoSlide(null, oceSlideName);
    } else {
      window.CLMPlayer.gotoSlide(slideName);
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
