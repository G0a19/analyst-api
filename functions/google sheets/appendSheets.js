const { google } = require("googleapis");

const appendSheets = async function (key, value, value1, value2, value3) {
  const auth = new google.auth.GoogleAuth({
    keyFile: require.main.path + "/functions/google sheets/credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1e6U7ae1zVcKS-DoKAiQif5HQUcTF5Cc-blyq7ux6eQM";

  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: `Sheets1!${key}:${value}`,
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[value1, value2, value3]],
    },
  });
};

module.exports = appendSheets;
