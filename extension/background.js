// Background service worker for Chrome extension
// Minimal implementation for MV3 compatibility

chrome.runtime.onInstalled.addListener(() => {
  console.log("Smart Product Matcher extension installed");
});
