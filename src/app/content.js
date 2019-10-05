

/** all content should provide via browser goes here : like links of page and files */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message !== "fetch_top_domains") return 0
  var urlHash = {}, links = document.links
  for (var i = 0; i < links.length; i++) {
    var domain = links[i].href.split('/')[2]
    debugger
    urlHash[domain] = (urlHash[domain])
      ? urlHash[domain] + 1
      : 1
  }
  chrome.runtime.sendMessage({ "message": "all_urls_fetched", "data": urlHash })
})