var cron = require("node-cron");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const appendSheets = require("./../appendSheets");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "animemix1877@gmail.com",
    pass: "axlibyisfdplmeay",
  },
});

const syncReq = async function () {
  const auth = new google.auth.GoogleAuth({
    keyFile: require.main.path + "/functions/google sheets/credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = process.env.SHEETS_ID;

  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheets1!H:K",
  });

  let table = ``;

  if (getRows.data.values) {
    getRows.data.values.forEach((row, index) => {
      if (index === 0) table += '<table border="1" style="color:black">';
      table += "<tr>";

      row.forEach((value, numberOfValue) => {
        if (index === 0) table += "<th style='background-color: grey;'>";
        else table += "<td>";
        table += value;
        if (index === 0) table += "</th>";
        else table += "</td>";
      });

      table += "</tr>";
      if (index === getRows.data.values.length - 1) table += "</table>";
    });

    let info = await transporter.sendMail({
      from: "animemix1877@gmail.com",
      to: "howtoexp30@gmail.com",
      subject: "dbirthday-app",
      text: `Table`,
      html: table,
    });
  }

  await googleSheets.spreadsheets.values.clear({
    spreadsheetId: process.env.SHEETS_ID,
    range: "H:K",
  });

  await appendSheets("H", "J", "IP", "METHOD", "PATH", "DATE");
};

cron.schedule("0 1 * * *", async function () {
  await syncReq;
});
