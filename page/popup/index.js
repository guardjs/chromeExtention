

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var activeTab = tabs[0]
  chrome.tabs.sendMessage(activeTab.id, { "message": "fetch_top_domains" })
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message !== "all_urls_fetched") return 0
  var urlWithMaxLinks
  var maxLinks = 0
  for (var key in request.data) {
    if (!request.data.hasOwnProperty(key)) return 0
    document.querySelector('#urlTable > tbody')
      .innerHTML += `<tr><td>${key}</td><td>${request.data[key]}</td></tr>`
    if (request.data[key] <= maxLinks) return 0
    maxLinks = request.data[key]
    urlWithMaxLinks = key
  }
  if (maxLinks != 0) {
    chrome.runtime.sendMessage({ "message": "open_max_url", "url": urlWithMaxLinks });
  }
})