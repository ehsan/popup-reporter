const FUNCTIONS_SUBDOMAIN = 'us-central1-orbital-hawk-197700';

chrome.runtime.onMessage.addListener(notify);

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

function notify(message) {
    if (message.type != "fetch") {
        return;
    }
    getPlatformInfo()
      .then(info => info.os)
      .then(os => {
          let platform = (os == "android") ? "Mobile" : "Desktop";
          return {
              url: message.url,
              desc: message.desc,
              platform: platform
          };
      })
      .then(data => {
          return fetch('https://' + FUNCTIONS_SUBDOMAIN + '.cloudfunctions.net/appendRecordToSpreadsheet', {
              method: 'POST',
              mode: 'cors',
              referrer: 'no-referrer',
              credentials: 'omit',
              cache: 'no-cache',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          });
      })
      .then(response => response.text())
      .then(() => chrome.runtime.sendMessage({type: "success"}))
      .catch(err => chrome.runtime.sendMessage({type: "error", err: err}));
}