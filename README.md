In-Page Pop-up Reporter
=======================

Are you tired of seeing in-page popups like this?

![in-page pop-up window](https://pbs.twimg.com/media/DX4CXMfW4AAaq5m.jpg)

Mozilla is experimenting with a popup blocker to dismiss them automatically, and are curating a dataset for it.  This extension provides an easy way to report pages that show pop-ups like this.

Download
--------

<img src="https://upload.wikimedia.org/wikipedia/commons/6/67/Firefox_Logo%2C_2017.svg" width="30" height="30"> [Firefox extension](https://addons.mozilla.org/en-US/firefox/addon/in-page-pop-up-reporter/)

<img src="https://upload.wikimedia.org/wikipedia/commons/e/e2/Google_Chrome_icon_%282011%29.svg" width="30" height="30"> [Chrome extension](https://chrome.google.com/webstore/detail/in-page-pop-up-reporter/dkpphegmeomaffjanagefmejpeebfcmh)

Installation
------------

This extension reports data into a Google Spreadsheet.  In order to not include the ID and auth info for the spreadsheet in the extension code, we use a Google Cloud lambda function to access the Google sheets API.

In order to deploy the firebase app, the first step is to visit the [Google APIs API Manager](https://console.developers.google.com/apis/credentials) and create Oauth 2.0 credentials. Click the Create Credentials button, then Oauth client ID, then Web Application (Google’s directions are [here](https://support.google.com/cloud/answer/6158849?hl=en)). In authorized redirect URIs, you’ll need to enter "https://`{YOUR-FUNCTIONS-SUBDOMAIN}`.cloudfunctions.net/Oauthcallback".

You will also need to change the `FUNCTIONS_SUBDOMAIN` constant in the beginning of `extension/background.js` to point to your Google Cloud function endpoint.

After that, you need to enter the following commands.  You need to replace `xxxxx` with the correct values depending on your environment.

```
cd cloud-function
cd functions
firebase login
# Enter the configuration settings
firebase functions:config:set googleapi.client_id="xxxxx" googleapi.client_secret="xxxxx" googleapi.spreadsheet_id="xxxxx" googleapi.function_subdomain="xxxxx"
firebase deploy --only functions

# Build the extension
cd ../..
cd extension
npm install
npm run firefox  # extension built in firefox-artifacts/
npm run chrome   # extension built in chrome-artifacts/
```
Once the functions are deployed, you need to visit this URL in your browser to authenticate your spreadsheet access on the Google Cloud side to ensure the extension will have access to update the spreadsheet: https://`{YOUR-FUNCTIONS-SUBDOMAIN}`.cloudfunctions.net/authGoogleAPI.

Acknowledgements
----------------
[This guide](https://medium.com/@elon.danziger/fast-flexible-and-free-visualizing-newborn-health-data-with-firebase-nodejs-and-google-sheets-1f73465a18bc) was used as a tutorial on how to talk to the Google Sheets API using Google Cloud functions.
