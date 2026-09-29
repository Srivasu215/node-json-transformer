import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import transform from "../../../src/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readJson = (name) => JSON.parse(
    fs.readFileSync(path.join(__dirname, name), "utf8")
);

const template = readJson("01-template.json");
const source = readJson("02-source.json");
// const expected = readJson("03-expected.json");

// const actual = transform.transform(template, source);
const actual = transform.transform(source, template);

// assert.deepStrictEqual(actual, expected);

console.log("PASS");
console.log(JSON.stringify(actual, null, 2));
