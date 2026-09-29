import fs from "fs";
import nodeJsonTransformer from "../../../../src/index.js";

import periodJson from './period.json' with {type: 'json'};

import transformJson from './transform.json' with {type: 'json'};

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
                    voucherNumber: "VOUCHERNUMBER",
                    reference: "REFERENCE.#text",
                    isDeemedPositive: "ISDEEMEDPOSITIVE.#text",
                    isInvoice: "ISINVOICE",
                    masterID: "MASTERID.#text",
                    voucherKey: "VOUCHERKEY.#text",
                    amount: "AMOUNT.#text",
                    vchType: "@_VCHTYPE",
                    inventoryEntries: [{
                        "list": "ALLINVENTORYENTRIES.LIST",
                        "item": {
                            stockItemName: "STOCKITEMNAME",
                            rate: "RATE",
                            amount: "AMOUNT",
                            actualQty: "ACTUALQTY",
                            billedQty: "BILLEDQTY"
                        }
                    }]
                }
            }]
        }
    }
};

const output = nodeJsonTransformer.transform(periodJson, transformJson);

console.log(JSON.stringify(output, null, 4));

// fs.writeFileSync("new.json", JSON.stringify(output));