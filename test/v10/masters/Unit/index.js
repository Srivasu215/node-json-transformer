import fs from "fs";
import nodeJsonTransformer from "../../../../src/index.js";

import unitsJson from './units.json' with {type: 'json'};

var transformation = {
    mapping: {
        item: {
            stockItems: [{
                "list": "UNIT",
                "item": {
                    unitName: "@_NAME"
                }
            }]
        }
    }
};

const output = nodeJsonTransformer.transform(unitsJson, transformation);

console.log("result : ", JSON.stringify(output, null, 4));

// fs.writeFileSync("new.json", JSON.stringify(output));