chromeContentSettings.javascript.get({
  'primaryUrl': url,
  'incognito': incognito
}, cc);


function cc(details) {
  setting = details.setting;
  if (setting) {
    var pattern = /^file:/.test(url) ? url : url.match(extractHostname)[0] + '/*';
    // old method : url.replace(/\/[^\/]*?$/, '/*')
    var newSetting = (setting == 'allow' ? 'block' : 'allow');
    chromeContentSettings.javascript.set({
      'primaryPattern': pattern,
      'setting': newSetting,
      'scope': (incognito ? 'incognito_session_only' : 'regular')
    }, c1d)
  }
  //console.info("javascript is now "+newSetting+"ed on "+pattern);
  else {
    //console.error("error, the setting is "+setting);
  }

}



function c1d() {
  updateIconAndMenu(newSetting);              /**
       * hack to fix chrome issue in incognito mode:
       * https://code.google.com/p/chromium/issues/detail?id=494501
       */
  if (incognito) {
    chrome.tabs.create({
      'url': url,
      'index': tabIndex
    }, function () { chrome.tabs.remove(tabId) });
  } else {
    if (cache.options.autoRefresh) {
      chrome.tabs.reload(tabId, { bypassCache: false });
    }
  } setStorageRule(pattern, newSetting);
}



function setStorageRule(pattern, newSetting) {
  if (!incognito) {
    var keyExist = false; if (cache.rules.length) {
      for (i = 0; i < cache.rules.length; i++) {
        if (pattern == cache.rules[i].primaryPattern) {
          cache.rules[i].setting = newSetting;
          keyExist = true;
          break;
        }
      }
    } if (!keyExist) {      // to do : keep only block, only allow or both   
      cache.rules.push({
        'primaryPattern': pattern,
        'setting': newSetting,
        'scope': (incognito ? 'incognito_session_only' : 'regular')
      });
    }    //window.localStorage.setItem('qjs_rules',JSON.stringify(rules));
    chromeStorageMethod.set({
      "rules": JSON.stringify(cache.rules)
    }, function () {
      console.log("saved ok");
    });
  }
}


function getStoragePrefs(callback) {
  chrome.storage.sync.get(['options', 'rules'], function (data) {
    if (data['options']) {
      cache.options = JSON.parse(data['options']);
    }    /*
 * set chrome storage method (local or sync) for options and rules
 */
    if (cache.options.useSync) {
      chromeStorageMethod = chrome.storage.sync;
    } else {
      chromeStorageMethod = chrome.storage.local;
    } if (data['rules']) {
      //console.log(data['rules']);      cache.rules = JSON.parse(data['rules']);
    } else {
      clearRules("localStorage");
    } if (callback) {
      callback();
    }
  });
}