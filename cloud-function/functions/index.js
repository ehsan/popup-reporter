const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin:'*', methods:['POST']});
const process = require('process');
const moment = require('moment');

admin.initializeApp(functions.config().firebase);
const db = admin.database();

const FUNCTIONS_SUBDOMAIN = functions.config().googleapi.function_subdomain;
const SHEET_ID = functions.config().googleapi.spreadsheet_id;

const FUNCTIONS_CLIENT_ID = functions.config().googleapi.client_id;
const FUNCTIONS_SECRET_KEY = functions.config().googleapi.client_secret;
const FUNCTIONS_REDIRECT = 'https://' + FUNCTIONS_SUBDOMAIN + '.cloudfunctions.net/OauthCallback';

const {OAuth2Client} = require('google-auth-library');
const {google} = require('googleapis');

let functionsOauthClient = new OAuth2Client(FUNCTIONS_CLIENT_ID, FUNCTIONS_SECRET_KEY,
  FUNCTIONS_REDIRECT);

let oauthTokens = null;

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

process.on('unhandledRejection', reason => {
    console.error("Unhandled rejection: " + reason);
});

// visit the URL for this Function to obtain tokens
exports.authGoogleAPI = functions.https.onRequest((req, res) =>
  res.redirect(functionsOauthClient.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  }))
);

// after you grant access, you will be redirected to the URL for this Function
// this Function stores the tokens to your Firebase database
const DB_TOKEN_PATH = '/api_tokens';
exports.OauthCallback = functions.https.onRequest((req, res) => {
  const code = req.query.code;
  functionsOauthClient.getToken(code, (err, tokens) => {
    // Now tokens contains an access_token and an optional refresh_token. Save them.
    if (err) {
      return res.status(400).send(err);
    }
    return db.ref(DB_TOKEN_PATH).set(tokens).then(() => res.status(200).send('OK'));
  });
});

// checks if oauthTokens have been loaded into memory, and if not, retrieves them
function getAuthorizedClient() {
  return new Promise((resolve, reject) => {
    if (oauthTokens) {
      return resolve(functionsOauthClient);
    }
    return db.ref(DB_TOKEN_PATH).once('value').then((snapshot) => {
      oauthTokens = snapshot.val();
      functionsOauthClient.setCredentials(oauthTokens);
      return resolve(functionsOauthClient);
    }).catch((err) => reject(err));
  });
}

// accepts an append request, returns a Promise to append it, enriching it with auth
function appendPromise(requestWithoutAuth) {
  return new Promise((resolve, reject) => {
    return getAuthorizedClient().then((client) => {
      const sheets = google.sheets('v4');
      const request = requestWithoutAuth;
      request.auth = client;
      console.log("before calling into sheets");
      return new Promise((resolve, reject) => {
        sheets.spreadsheets.values.append(request, (err, response) => {
            if (err) {
            console.log(`The API returned an error: ${err}`);
            return reject(err);
            }
            return resolve(response);
        });
      });
    }).catch((err) => reject(err));
  });
}

exports.appendRecordToSpreadsheet = functions.https.onRequest((req, res) => {
  let url = req.body.url;
  let desc = req.body.desc;
  let platform = req.body.platform;
  let now = moment().format('M/D/YYYY H:m:s');
  return cors(req, res, () => {
    return appendPromise({
        spreadsheetId: SHEET_ID,
        range: 'A:D',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values: [[now, url, desc, platform]]
        }
    }).then(res.status(200).send('OK'));
  });
});