const axios = require("axios");
const cheerio = require("cheerio");
const httpError = require("../shared/httpError");
const getKey = require("../../keys/getKey");
const Stock = require("../../mongodb/stock");

const crypto = async function (req, res, next) {
  const { key } = req.params;
  if (!key) return httpError(res, "No key found", 404);
  if (key !== getKey("KEY")) return httpError(res, "Invalid key", 404);

  const coinArr = [];

  for (let numberOfPage = 1; numberOfPage <= 100; numberOfPage++) {
    try {
      let siteUrl = "https://coinmarketcap.com/";
      if (numberOfPage !== 1) siteUrl = siteUrl + "?page=" + numberOfPage;
      const { data } = await axios({
        method: "GET",
        url: siteUrl,
      });
      const $ = cheerio.load(data);
      const elemSelector = `#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div > div.h7vnx2-1.bFzXgL > table > tbody > tr`;
      const keys = [
        "rank",
        "name",
        "price",
        "24h",
        "7d",
        "marketCap",
        "volume",
        "circulatingSupply",
      ];

      $(elemSelector).each((parentIdx, parentElem) => {
        if (parentIdx <= 10) {
          let keyIdx = 0;
          let coinObj = {};
          // if (parentIdx <= cryptoNumber) {
          $(parentElem)
            .children()
            .each((childIdx, childElem) => {
              let tdValue = $(childElem).text();

              if (keyIdx === 1 || keyIdx === 6) {
                tdValue = $("p:first-child", $(childElem).html()).text();
              }

              if (tdValue) {
                coinObj[keys[keyIdx]] = tdValue;
                keyIdx++;
              }
            });

          coinArr.push(coinObj);
          // }
        } else {
          const cryptoSymbol = $(parentElem)
            .find("td:nth-child(3) .crypto-symbol")
            .text();

          const treeSpan = $(parentElem)
            .find("td:nth-child(3) .cmc-link")
            .html();
          const cryptoName = treeSpan
            .split("<span")[2]
            .replace("</span>", "")
            .replace(">", "");

          let coinObj = {
            name: cryptoName + " " + cryptoSymbol,
          };
          coinArr.push(coinObj);
        }
      });
    } catch (err) {
      console.log(err);
      if (!key) return httpError(res, "Sync failed", 404);
    }
  }

  for (numberOfCrypto = 0; numberOfCrypto < coinArr.length; numberOfCrypto++) {
    try {
      const currectStock = await Stock.findOne({
        name: coinArr[numberOfCrypto].name,
      });
      if (currectStock) continue;
      const newStock = new Stock({
        name: coinArr[numberOfCrypto].name,
        type: "crypto",
        dateAdded: new Date().toISOString(),
      });
      await newStock.save();
    } catch (err) {
      console.log(err);
      if (!key) return httpError(res, "Stock save failed", 404);
    }
  }

  return res.json(coinArr);
};

module.exports = crypto;
