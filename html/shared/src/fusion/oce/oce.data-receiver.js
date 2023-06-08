const oceData = require('./oce.data-utils');

class OceDataReceiver {
  static get env() {
    return 'oce';
  }

  /**
   * @returns {EnvironmentData}
   */
  static async getData() {
    const oceBinder = oceData.constructor.getCurrentPresentationData();
    const oceSlides = oceData.constructor.getCurrentPresentationSlides();
    const oceSlide = oceData.constructor.getCurrentSlideData();
    return { binder: oceBinder, slides: this.mapSlides(oceSlides), slide: this.mapSlide(oceSlide) };
  }

  static mapSlide({ name }) {
    return {
      name: oceData.constructor.getActivatorSlideName(name),
    };
  }

  static mapSlides(slides) {
    return slides.map((slide) => this.mapSlide(slide));
  }
}

module.exports = OceDataReceiver;
