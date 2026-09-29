import fs from "fs";
import nodeJsonTransformer from "../../src/index.js";


import periodJson from './period.json' with {type: 'json'};

const transformation = {
    mapping: {
        item: {
            vouchers: [
                {
                    list: "items",
                    item: {
                        date: "DATE.#text",
                        guid: "GUID",
                        voucherType: "VOUCHERTYPENAME",
                        party: "PARTYLEDGERNAME.#text",
                        voucherNumber: "VOUCHERNUMBER",
                        reference: "REFERENCE.#text",
                        numberingStyle: "NUMBERINGSTYLE",
                        persistedView: "PERSISTEDVIEW",
                        isInvoice: "ISINVOICE",
                        masterId: "MASTERID.#text",
                        voucherKey: "VOUCHERKEY.#text",
                        amount: "AMOUNT.#text",

                        items: [
                            {
                                list: "ALLINVENTORYENTRIES.LIST",
                                item: {
                                    stockItem: "STOCKITEMNAME",
                                    rate: "RATE",
                                    amount: "AMOUNT",
                                    actualQty: "ACTUALQTY",
                                    billedQty: "BILLEDQTY",

                                    batch: {
                                        batchId: "BATCHALLOCATIONS.LIST.BATCHID.#text",
                                        batchName: "BATCHALLOCATIONS.LIST.BATCHNAME",
                                        godown: "BATCHALLOCATIONS.LIST.GODOWNNAME",
                                        amount: "BATCHALLOCATIONS.LIST.AMOUNT",
                                        actualQty: "BATCHALLOCATIONS.LIST.ACTUALQTY",
                                        billedQty: "BATCHALLOCATIONS.LIST.BILLEDQTY",
                                        batchRate: "BATCHALLOCATIONS.LIST.BATCHRATE.#text",
                                        manufacturingDate: "BATCHALLOCATIONS.LIST.MFDON"
                                    },

                                    accounting: {
                                        ledger: "ACCOUNTINGALLOCATIONS.LIST.LEDGERNAME",
                                        amount: "ACCOUNTINGALLOCATIONS.LIST.AMOUNT"
                                    }
                                }
                            }
                        ],

                        ledger: {
                            name: "LEDGERENTRIES.LIST.LEDGERNAME.#text",
                            amount: "LEDGERENTRIES.LIST.AMOUNT.#text"
                        }
                    }
                }
            ]
        }
    }
};

const transformCompany = (inData) => {
    if (inData === undefined || inData === null) {
        return inData;
    };

    const isArray = Array.isArray(inData);

    const localInput = {
        items: isArray
            ? inData
            : [inData]
    };

    // console.log(
    //     "INVENTORY:",
    //     JSON.stringify(
    //         localInput.items[0]?.["ALLINVENTORYENTRIES.LIST"],
    //         null,
    //         2
    //     )
    // );

    // console.log(
    //     "LEDGER:",
    //     JSON.stringify(
    //         localInput.items[0]?.["LEDGERENTRIES.LIST"],
    //         null,
    //         2
    //     )
    // );

    const localOutput = nodeJsonTransformer.transform(
        localInput,
        transformation
    );

    return isArray
        ? localOutput.vouchers
        : localOutput.vouchers[0];
};

const output = transformCompany(periodJson.VOUCHER);

console.log(JSON.stringify(output, null, 4));

fs.writeFileSync("new.json", JSON.stringify(output));