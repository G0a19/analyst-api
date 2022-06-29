const { v1: uuidv1 } = require("uuid");
const fs = require("fs");
const googleSheetsMethod = require("./../functions/google sheets/googleSheetsMethod");
const getKey = require("./getKey");

const createNewKey = async function (key) {
  var id = uuidv1();
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

  let splitEnv = env.split("\n");
  const indexCode = splitEnv.findIndex((row) => row.includes(key));
  const indexOfEquels = splitEnv[indexCode].indexOf("=");
  splitEnv[indexCode] = splitEnv[indexCode].slice(0, indexOfEquels);
  splitEnv[indexCode] = splitEnv[indexCode] + `=${id}`;
  env = splitEnv.join("\n");
  fs.writeFileSync(require.main.path + "/keys.txt", env, (err) => {
    console.log(err);
  });

  await googleSheetsMethod("A2", "B2", getKey("KEY"));
};

module.exports = createNewKey;
