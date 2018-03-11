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
              return tab.url;
          }
      })
      .then(url => urlField.value = url);

    var submit = document.querySelector("input[type=submit]");
    submit.onclick = function() {
        report();
        return false;
    };
};

chrome.runtime.onMessage.addListener(notify);

function notify(message) {
    let status = document.getElementById("status");
    switch (message.type) {
    case "success":
        status.innerText = 'Done, thanks for your report!';
        setTimeout(function() {
            status.innerText = '';
        }, 1000);
        break;
    case "error":
        status.innerText = 'Error occurred: ' + message.err;
        setTimeout(function() {
            status.innerText = '';
        }, 5000);
        break;
    }
}

function report() {
    let url = document.getElementById("url");
    let desc = document.querySelector("textarea");
    let status = document.getElementById("status");
    status.innerText = "Sending...";
    chrome.runtime.sendMessage({url: url.value, desc: desc.value, type:"fetch"});
}