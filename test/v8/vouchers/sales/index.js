import fs from "fs";
import nodeJsonTransformer from "../../../../src/index.js";

import periodJson from './period.json' with {type: 'json'};

var transformation = {
    mapping: {
        item: {
            vouchers: [{
                "list": "VOUCHER",
                "item": {
                    date: "DATE.#text",
                    voucherTypeName: "VOUCHERTYPENAME",
                    baseUnit: "BASEUNITS.#text",
                    partyLedgerName: "PARTYLEDGERNAME.#text",
                    batches: [{
                        "list": "BATCHALLOCATIONS.LIST",
                        "item": {
                            godownName: "GODOWNNAME.#text",
                            batchName: "BATCHNAME",
                            openingBalance: "OPENINGBALANCE",
                            openingValue: "OPENINGVALUE",
                            openingRate: "OPENINGRATE"
                        }
                    }]
                }
            }]
        }
    }
};

const output = nodeJsonTransformer.transform(periodJson, transformation);

console.log(JSON.stringify(output, null, 4));

// fs.writeFileSync("new.json", JSON.stringify(output));