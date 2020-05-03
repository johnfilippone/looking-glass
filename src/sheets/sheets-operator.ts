'use strict'

import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'config/token.json';

// Responsible for communicating with the Google Sheets API
class SheetsOperator {
    _auth: any
    _logger: any
    _credentialsPath: any
    constructor(logger, credentialsPath) {
        this._auth = null;
        this._logger = logger;
        this._credentialsPath = credentialsPath;
    }

    async getSheet(spreadsheetId, range) {
        const auth = this._auth;
        const sheets = google.sheets({version: 'v4', auth});
        return new Promise((resolve, reject) => {
            sheets.spreadsheets.values.get({ spreadsheetId, range }, (err, res) => {
                if (err) return reject('The API returned an error: ' + err);
                resolve(res.data.values);
            });
        });
    }

    async connect() {
        try {
            const credentials = JSON.parse(fs.readFileSync(this._credentialsPath).toString());
            const {client_secret, client_id, redirect_uris} = credentials.web;
            const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

            let token = null;
            if (fs.existsSync(TOKEN_PATH)) {
                token = JSON.parse(fs.readFileSync(TOKEN_PATH).toString());
            } else {
                logger.info('get token');
                token = await this._getNewToken(oAuth2Client);
            }
            if (!token) throw new Error('null token');

            oAuth2Client.setCredentials(token);
            this._auth = oAuth2Client;

        } catch(err) {
            logger.error(err);
            process.exit(1);
        }
    }

    async _getNewToken(oAuth2Client) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        logger.info('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        return new Promise((resolve, reject) => {
            rl.question('Enter the code from that page here: ', (code) => {
                rl.close();
                oAuth2Client.getToken(code, (err, token) => {
                    if (err) {
                        return reject('Error while trying to retrieve access token: ' + err);
                    }

                    // Store the token to disk for later program executions
                    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
                    logger.info('Token stored to', TOKEN_PATH);

                    return resolve(token);
                });
            });
        });
    }

}

export default SheetsOperator;
