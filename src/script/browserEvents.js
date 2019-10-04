

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message !== "open_max_url") return 0
  fullURL = "http://" + request.url;
  chrome.tabs.create({ "url": fullURL, "active": false });
});