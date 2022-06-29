const fs = require("fs");

const getKey = function (key) {
  let env = fs.readFileSync(
    require.main.path + "/keys.txt",
    "utf8",
    function (err, data) {
      if (err) {
        console.log(err);
        return;
      }
    }
  );

  let splitENV = env.split("\n");
  const indexCode = splitENV.findIndex((row) => row.includes(key));
  const splitString = splitENV[indexCode].split("=");
  return splitString[1];
};

module.exports = getKey;
