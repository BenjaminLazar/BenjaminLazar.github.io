window.CLIENT_BROWSER = {};
window.CLIENT_BROWSER.isIE = /MSIE \d|Trident.*rv:/.test(navigator.userAgent);
if (window.CLIENT_BROWSER.isIE) {
  document.write('<script src="../shared/src/fusion/_vendor/polyfill.min.js"></script>');
}
