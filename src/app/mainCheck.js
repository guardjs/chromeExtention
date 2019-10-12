

// the analysis of files goes here
function changeSettings() {
  setKickStarterBadge(1000, true)
  if (!matchForbiddenOrigin) {
    chromeContentSettings.javascript.get({
      'primaryUrl': url,
      'incognito': incognito
    }, function (details) {
      setting = details.setting;
      if (setting) {
        var pattern = /^file:/.test(url) ? url : url.match(extractHostname)[0] + '/*';
        // old method : url.replace(/\/[^\/]*?$/, '/*')
        var newSetting = (setting == 'allow' ? 'block' : 'allow');
        chromeContentSettings.javascript.set({
          'primaryPattern': pattern,
          'setting': newSetting,
          'scope': (incognito ? 'incognito_session_only' : 'regular')
        }, function () {
          updateIconAndMenu(newSetting);              /**
             * hack to fix chrome issue in incognito mode:
             * https://code.google.com/p/chromium/issues/detail?id=494501
             */
          if (incognito) {
            chrome.tabs.create({
              'url': url,
              'index': tabIndex
            }, function () {
              chrome.tabs.remove(tabId);
            });
          } else {
            if (cache.options.autoRefresh) {
              chrome.tabs.reload(tabId, { bypassCache: false });
            }
          } setStorageRule(pattern, newSetting);
        });          //console.info("javascript is now "+newSetting+"ed on "+pattern);
      } else {
        //console.error("error, the setting is "+setting);
      }
    });
  } else {    //console.error("You can't disable javascript on "+url);  }}
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
    } function importRules(importedRules) {
      var rules = importedRules;  // todo : delete spaces  if (importedRules.length) {
      for (i = 0; i < importedRules.length; i++) {
        chrome.contentSettings.javascript.set({
          'primaryPattern': rules[i].primaryPattern,
          'setting': rules[i].setting,
          'scope': rules[i].scope
        });
      }
    }  //window.localStorage.setItem('qjs_rules',JSON.stringify(rules));
    chromeStorageMethod.set({
      "rules": JSON.stringify(importedRules)
    }, function () {
      cache.rules = importedRules;
      console.log("import ok");
    });
  } function clearRules(arg, incognito) {
    var incognito = incognito || false; if (arg == "contentSettings" || arg === undefined) {
      chromeContentSettings.javascript.clear({
        'scope': (incognito ? 'incognito_session_only' : 'regular')
      });
    }
    if (arg == "localStorage" || arg === undefined) {
      cache.rules = [];
      //window.localStorage.setItem('qjs_rules',[]);
      chromeStorageMethod.set({
        "rules": JSON.stringify([])
      }, function () {
        console.log("clear ok");
      });
    }
  } function checkVersion(callback) {  /**
 * version storage need to be local */
    chrome.storage.local.get(['version'], function (data) {
      var oldValue = data['version'] || window.localStorage.qjs_version || undefined;
      var newValue = getVersion(); if (oldValue !== newValue) {
        if (typeof oldValue == 'undefined') {
          onInstall();
        } else {
          onUpdate();
        } chrome.storage.local.set({
          "version": newValue
        }, function () {
          console.log("version ok");
        }); if (callback) {
          callback();
        }
      }
    });
  } function getStoragePrefs(callback) {
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
  // Check if the version has changed.function onInstall() {
  console.log('install');
  if (cache.rules) {
    importRules(cache.rules);
  }
}