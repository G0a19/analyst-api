const appendSheets = require("./../functions/google sheets/appendSheets");
const { networkInterfaces } = require("os");

module.exports = async (req, res, next) => {
  const nets = networkInterfaces();
  const results = Object.create(null); // Or just '{}', an empty object

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
      if (net.family === familyV4Value && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }

  console.log(results);

  // try {
  //   appendSheets(
  //     "H",
  //     "J",
  //     Object.values(results)[1][0] ?? "null",
  //     req.method,
  //     new Date().toISOString()
  //   );
  // } catch (err) {
  //   console.log(err);
  // }

  next();
};
