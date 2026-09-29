import fs from "fs";
import nodeJsonTransformer from "../../../../src/index.js";

import periodJson from './period.json' with {type: 'json'};

import transformJson from './transform.json' with {type: 'json'};

const output = nodeJsonTransformer.transform(periodJson, transformJson);

console.log(JSON.stringify(output, null, 4));

// fs.writeFileSync("new.json", JSON.stringify(output));