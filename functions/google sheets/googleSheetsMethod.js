const { google } = require("googleapis");

const googleSheetsMethod = async function (key, value, id) {
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

  var request = {
    auth,
    spreadsheetId,
    range: `Sheets1!${key}:${value}`,
    valueInputOption: "RAW",
    resource: {
      values: [["KEY", id]],
    },
  };

  await googleSheets.spreadsheets.values.update(request, (err, res) => {
    if (err) return console.log("The API returned an error: " + err);
  });
};

//   await googleSheets.spreadsheets.values.append({
//     auth,
//     spreadsheetId,
//     range: "Sheets1!A:B",
//     valueInputOption: "USER_ENTERED",
//     resource: {
//       values: [["good", "job"]],
//     },
//   });

//   const getRows = await googleSheets.spreadsheets.values.get({
//     auth,
//     spreadsheetId,
//     range: "Sheets1!B:B",
//   });

module.exports = googleSheetsMethod;
