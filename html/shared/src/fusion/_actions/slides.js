export const REGISTER_SLIDES = 'REGISTER_SLIDES';

export const registerSlides = (slides, start) => (dispatch) => {
  const firstSlide = start || slides[0];
  dispatch({
    type: REGISTER_SLIDES,
    slides,
    firstSlide,
  });
};
