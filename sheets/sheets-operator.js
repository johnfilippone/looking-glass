'use strict'

import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    auth = oAuth2Client;
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function getBodyWeight(auth) {
    const sheets = google.sheets({version: 'v4', auth});
    const sheetPromise = new Promise((resolve, reject) => {
        sheets.spreadsheets.values.get({
            spreadsheetId: '1DRXq0Uo_eVzgnT4bwo202XAU9YWltCa_8W26jhEaaxQ',
            range: 'Metrics',
        }, (err, res) => {
            if (err) return reject('The API returned an error: ' + err);
            const rows = res.data.values;
            if (rows.length) {
                console.log('Found data');
                resolve(rows);
            } else {
                resolve('No data found.');
            }
        });
    });

    return await sheetPromise;
}

async function getConnectingData(auth) {
    const sheets = google.sheets({version: 'v4', auth});
    const sheetPromise = new Promise((resolve, reject) => {
        sheets.spreadsheets.values.get({
            spreadsheetId: '1ucWB8jjQIYJa_K4K0NsDA9owCeWYs1buClTVvE2JqJw',
            range: 'Connecting Volume',
        }, (err, res) => {
            if (err) return reject('The API returned an error: ' + err);
            const rows = res.data.values;
            if (rows.length) {
                console.log('Found data');
                resolve(rows);
            } else {
                resolve('No data found.');
            }
        });
    });

    return await sheetPromise;
}

// Responsible for communicating with the Google Sheets API
class SheetsOperator {
    constructor(credentialsPath) {
        this._credentialsPath = credentialsPath;
        this._auth = null;
    }

    async getSheet(spreadsheetId, range) {
        const sheets = google.sheets({version: 'v4', this._auth});
        return new Promise((resolve, reject) => {
            sheets.spreadsheets.values.get({ spreadsheetId, range }, (err, res) => {
                if (err) return reject('The API returned an error: ' + err);
                resolve(res.data.values);
            });
        });
    }

    async connect() {
        try {
            const rawCredentials = fs.readFileSync(this._credentialsPath);
            const credentials = JSON.parse(rawCredentials);
            const {client_secret, client_id, redirect_uris} = credentials.web;
            const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

            let token = null;
            if (fs.existsSync(TOKEN_PATH)) {
                token = JSON.parse(fs.readFileSync(TOKEN_PATH));
            } else {
                token = await this._getNewToken(oAuth2Client);
            }

            oAuth2Client.setCredentials(token);
            this._auth = oAuth2Client;

        } catch(err) {
            console.error(err);
            process.exit(1);
        }
    }

    async _getNewToken(oAuth2Client) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        return questionPromise = new Promise((resolve, reject) => {
            rl.question('Enter the code from that page here: ', (code) => {
                rl.close();
                oAuth2Client.getToken(code, (err, token) => {
                    if (err) reject('Error while trying to retrieve access token: ' + err);

                    // Store the token to disk for later program executions
                    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
                    console.log('Token stored to', TOKEN_PATH);

                    resolve(token);
                });
            });
        });
    }

}

export default SheetsOperator;
