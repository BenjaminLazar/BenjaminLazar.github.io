/**
 * // recursively iterates over all child elements, skips children of stateful elements
 * @param {HTMLElement} parent
 * @param {function} cb
 * @param {function} baseCtor
 */
export const iterateNonStatefulChildren = (parent, cb, baseCtor) => {
  const childEls = [...parent.children];
  childEls.forEach((el) => {
    if (el instanceof baseCtor) {
      cb(el);
    }
    if (!el.isStateful) {
      iterateNonStatefulChildren(el, cb, baseCtor);
    }
  });
};
