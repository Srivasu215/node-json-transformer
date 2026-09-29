import fs from "fs";
import nodeJsonTransformer from "../../../../src/index.js";

import unitsJson from './data.json' with {type: 'json'};
import transformJson from './transform.json' with {type: 'json'};

const output = nodeJsonTransformer.transform(unitsJson, transformJson);

console.log("result : ", JSON.stringify(output, null, 4));

// fs.writeFileSync("new.json", JSON.stringify(output));