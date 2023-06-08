// functions which we use in EnvironmentDetector to detect Activator
const isInIframe = () => window.location !== window.parent.location;
const isAwsHosted = () => window.location.host.includes('amazonaws.com');
const getBundle = () => {
  if (isInIframe() && isAwsHosted()) {
    document.write("<script src='../shared/dist/main.js'></script>");
  } else {
    document.write("<script src='../shared/dist/main-prod.js'></script>");
  }
};
getBundle();
