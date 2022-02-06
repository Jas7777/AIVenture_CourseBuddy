const csv = require("./csv-parse.js");
const data = require("fs").readFileSync("catalog.csv", "utf-8")
console.log(csv(data).map(row=>row.length).join(" "));