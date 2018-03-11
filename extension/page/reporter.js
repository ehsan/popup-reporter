onload = function() {
    var urlField = document.getElementById("url");
    let options = {active: true};
    browser.runtime.getPlatformInfo()
      .then(info => info.os)
      .then(os => {
          if (os != "android") {
              options.windowId = browser.windows.WINDOW_ID_CURRENT;
          }
          return browser.tabs.query(options);
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

browser.runtime.onMessage.addListener(notify);

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
    browser.runtime.sendMessage({url: url.value, desc: desc.value, type:"fetch"});
}