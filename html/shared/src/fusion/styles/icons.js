import { css, unsafeCSS } from 'lit-element';

const iconAccordance = new Map([
  ['button', '\\e939'],
  ['links', '\\e93d'],
  ['edit', '\\e908'],
  ['delete', '\\e90b'],
  ['reorder', '\\e911'],
  ['image', '\\e93b'],
  ['iframe', '\\e959'],
]);

export const generalIconsStyles = css`
  i {
    /* use !important to prevent issues with browser extensions that change fonts */
    font-family: 'Blackburn' !important;
    speak: never;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    /* Better Font Rendering =========== */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

export const getIconsStyles = (...icons) => icons.map((icon) => unsafeCSS(`
  .icon-${icon}-outlined:before {
    content: '${iconAccordance.get(icon)}';
  }
 `));
