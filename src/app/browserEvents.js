

/**  all events from browser goes here */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message !== "open_max_url") return 0
  fullURL = "http://" + request.url
  chrome.tabs.create({ "url": fullURL, "active": false })
})
chrome.commands.onCommand.addListener(function (command) {
  if (command == "toggle-popup") {
    // TODO: show popup
  }
})