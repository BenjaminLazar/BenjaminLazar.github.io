/**
 * Inspired by http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * and https://www.typescriptlang.org/docs/handbook/mixins.html
 *
 * To use a mixin just "extend" your class from applyMixins(BaseClass, [mixin])
 */

import { AspectRatioSwitcher } from './aspect-ratio-switcher';
import { AsyncComponentDetection } from './async-component-detection';
import { BriefComponentBase } from './brief-base';
import { ChildrenStylist } from './children-stylist';
import { ContentModule } from './content-module';
import { EmailBorder } from './email-border';
import { EmailComponent } from './email';
import { EmailComponentBaseClasses } from './email-component-classes';
import { EnvDependComponent } from './env-depend-component';
import { FontEmail } from './font-email';
import { ItemsWrapper } from './items-wrapper';
import { LazyComponent } from './lazy-component';
import { LinkExtension } from './link-extension';
import { ModeTrackable } from './mode-trackable';
import { PopupElement } from './popup-element';
import { SafeFontFamilyCombination } from './safe-font-family-combination';
import { SlideComponentBase } from './slide-base';
import { SlideshowElement } from './slideshow-element';
import { Stateful } from './stateful';

/**
 * @param {constructor} superClass: class to be extended
 * @param {Array} mixins:
 * @returns {*}
 */
function applyMixins(superClass, mixins) {
  return mixins.reduce((extendedClass, mixin) => mixin(extendedClass), superClass);
}

export {
  LazyComponent,
  ModeTrackable,
  LinkExtension,
  EmailComponent,
  ItemsWrapper,
  applyMixins,
  Stateful,
  ChildrenStylist,
  AspectRatioSwitcher,
  PopupElement,
  FontEmail,
  SafeFontFamilyCombination,
  EnvDependComponent,
  SlideshowElement,
  EmailComponentBaseClasses,
  EmailBorder,
  SlideComponentBase,
  BriefComponentBase,
  ContentModule,
  AsyncComponentDetection,
};
