import { delay } from '../utils';

/**
 * Performs lazy render
 */

export function LazyComponent(superClass) {
  return class extends superClass {
    async performUpdate() {
      await delay();
      super.performUpdate();
    }
  };
}
