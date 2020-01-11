let isChromium = window.chrome;
let winNav = window.navigator;
let vendorName = winNav.vendor;
let isOpera = typeof window.opr !== "undefined";
let isIEedge = winNav.userAgent.indexOf("Edge") > -1;
let isIOSChrome = winNav.userAgent.match("CriOS");

export default function isChrome() {
  if (
    (isChromium &&
      typeof isChromium !== "undefined" &&
      vendorName === "Google Inc." &&
      !isOpera &&
      !isIEedge) ||
    isIOSChrome
  ) {
    return true;
  }
  return false;
}
