import { FusionApi } from '../api';
import config from '../../config.json';

const { navigation } = config;

/**
 * @description Inits swipes between slides in Activator, Veeva, OCE.
 * Value 'customSwipes' affects on Activator, Veeva and OCE swipes.
 */
export const initSwipeListeners = () => {
  if (navigation.customSwipes) {
    document.addEventListener('swipeleft', () => {
      FusionApi.goTo('', '', 'next');
    });
    document.addEventListener('swiperight', () => {
      FusionApi.goTo('', '', 'previous');
    });
  }
};
