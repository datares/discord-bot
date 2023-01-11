const { GoogleSpreadsheet } = require('google-spreadsheet');

const API_KEY = process.env.GOOGLE_API_KEY;
const SHEET_ID = process.env.SHEET_ID;
const SHEET_GID = process.env.SHEET_GID

const readSheet = async () => {
	const doc = new GoogleSpreadsheet(SHEET_ID);
	doc.useApiKey(API_KEY);
	// https://theoephraim.github.io/node-google-spreadsheet/#/classes/google-spreadsheet-worksheet
	await doc.loadInfo();
	// https://theoephraim.github.io/node-google-spreadsheet/#/classes/google-spreadsheet-worksheet?id=basic-sheet-properties
	const sheet = doc.sheetsById[SHEET_GID];
	const rows = await sheet.getRows({ offset:0 });
	const data = [];
	for (const row of rows) {
		data.push({ name: row.Name, email: row.Email, status: row.Status });
	}
	return data;
};


module.exports = readSheet;

