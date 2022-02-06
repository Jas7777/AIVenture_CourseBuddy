// deps
const fs = require("fs");
const parseCSV = require("./csv-parse.js");

// load and parse data
const data = parseCSV(fs.readFileSync("catalog.csv", "utf-8"));
const fields = ["description", "credits", "schools", "subject", "gradesAvailable", "ucCategory", "title", "prereqs", "footnotes", "unknown", "courseCode"];

// turn to objects and write
const valid = data.filter(row => row.length == fields.length);
fs.writeFileSync("data.json", JSON.stringify(valid.map(row => Object.fromEntries(row.map((x, i) => [fields[i], x])))));


//fs.writeFileSync("data.json", data.filter())
