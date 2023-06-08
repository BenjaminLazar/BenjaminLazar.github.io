/**
 * class OceData - service for working with OCE presentation structure.
 */
class OceData {
  /**
   * @typedef {Object} OceSlideObj
   * @property {String} name - oce slide name (html file name - '01_test-slide.html')
   */

  /**
   * @typedef {Object} OcePresentationObj
   * @property {String} id
   * @property {String} name
   * @property {Array} sequences - one or many items depends on build
   */

  /**
   * @returns {OcePresentationObj}
   */
  static getCurrentPresentationData() {
    const { presentations, presentationIndex } = window.oce.config;
    return presentations[presentationIndex];
  }

  static isDeepPresentation() {
    const { sequences } = this.getCurrentPresentationData();
    const { slides } = sequences[0];
    return sequences.length === 1 && slides.length > 1;
  }

  static getCurrentSlideIndex() {
    const { slideIndex } = window.oce.config;
    return slideIndex;
  }

  /**
   * @returns {Array<OceSlideObj>}
   */
  static getCurrentPresentationSlides() {
    const { sequences } = this.getCurrentPresentationData();
    let slides;
    if (this.isDeepPresentation()) {
      slides = sequences[0].slides;
    } else {
      slides = sequences.map((sequence) => sequence.slides[0]);
    }
    return slides;
  }

  /**
   * @param {String} activatorSlide - activator slide name
   * @returns {String} slide name in OCE (html file name)
   */
  static getOceSlideName(activatorSlide) {
    const oceSlide = this.getCurrentPresentationSlides()
      .find((slide) => this.getActivatorSlideName(slide.name) === activatorSlide);
    return oceSlide.name;
  }

  /**
   * for multi sequence structure
   * @param {String} activatorSlide - activator slide name
   * @returns {String} sequence externalId in OCE
   */
  static getOceSlideExtId(activatorSlide) {
    const { sequences } = this.getCurrentPresentationData();
    const oceSlideName = this.getOceSlideName(activatorSlide);
    const sequence = sequences.find((item) => item.slides[0].name === oceSlideName);
    return sequence.externalid;
  }

  /**
   * @returns {OceSlideObj}
   */
  static getCurrentSlideData() {
    const { slideIndex } = window.oce.config;
    return this.getCurrentPresentationSlides()[slideIndex];
  }

  /**
   * @param {String} oceSlide - OCE slide name(html file name)
   * @returns {String} slide name in activator
   */
  static getActivatorSlideName(oceSlide) {
    const [, ...rest] = oceSlide.split('_');
    return rest.join('_').replace('.html', '');
  }
}

const oceData = new OceData();
module.exports = oceData;
