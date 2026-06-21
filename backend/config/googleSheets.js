const { google } = require('googleapis');
const path = require('path');

// Google Sheets Configuration
// You need to place your service account credentials in google-credentials.json
const CREDENTIALS_PATH = path.join(__dirname, 'google-credentials.json');

// Get the Spreadsheet ID from environment variable or set it here
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || '1YEt8tVCk3IDKevpVItO1EIjI1ZCeVUqozbnToqQs2uA';

class GoogleSheetsService {
  constructor() {
    this.auth = new google.auth.GoogleAuth({
      keyFile: CREDENTIALS_PATH,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  }

  async getClient() {
    return await this.auth.getClient();
  }

  async getSheets() {
    const client = await this.getClient();
    return google.sheets({ version: 'v4', auth: client });
  }

  async syncData(values) {
    if (SPREADSHEET_ID === 'REPLACE_WITH_YOUR_SPREADSHEET_ID') {
      throw new Error('Spreadsheet ID belum dikonfigurasi di backend');
    }

    try {
      const sheets = await this.getSheets();
      
      // 1. Clear the sheet first (we overwrite everything with current DB state)
      await sheets.spreadsheets.values.clear({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Sheet1!A1:Z',
      });

      // 2. Write the new data
      const result = await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Sheet1!A1',
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });

      return result.data;
    } catch (err) {
      console.error('The API returned an error: ' + err);
      throw err;
    }
  }
}

module.exports = {
  googleSheetsService: new GoogleSheetsService(),
};
