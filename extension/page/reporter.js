function getPlatformInfo() {
    try {
        return browser.runtime.getPlatformInfo();
    } catch (e) {
        return new Promise((resolve, reject) => {
            chrome.runtime.getPlatformInfo(function(info) {
                resolve(info);
            });
        });
    }
}

function queryTabs(options) {
    try {
        return browser.tabs.query(options);
    } catch (e) {
        return new Promise((resolve, reject) => {
            chrome.tabs.query(options, function(tabs) {
                resolve(tabs);
            });
        });
    }
}

onload = function() {
    var urlField = document.getElementById("url");
    var favicon = document.getElementById("favicon");
    let options = {active: true};
    getPlatformInfo()
      .then(info => info.os)
      .then(os => {
          if (os != "android") {
              options.windowId = chrome.windows.WINDOW_ID_CURRENT;
          }
          return queryTabs(options);
      })
      .then(tabs => {
          for (let tab of tabs) {
              return tab;
          }
      })
      .then(tab => {
          urlField.value = tab.url;
          if tab.favIconUrl {
            favicon.src = tab.favIconUrl;
            setTimeout(() => favicon.classList.add("loaded"), 10);
        }
      });

    var submit = document.getElementById("report");
    submit.onclick = function() {
        report();
        return false;
    };
};

function report() {
    let url = document.getElementById("url");
    let desc = document.querySelector("textarea");
    chrome.runtime.sendMessage({url: url.value, desc: desc.value, type:"fetch"});
    window.close();
}