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

                                    batch: [
                                        {
                                            list: "BATCHALLOCATIONS.LIST",
                                            item: {
                                                batchId: "BATCHID.#text",
                                                batchName: "BATCHNAME",
                                                godown: "GODOWNNAME",
                                                amount: "AMOUNT",
                                                actualQty: "ACTUALQTY",
                                                billedQty: "BILLEDQTY",
                                                batchRate: "BATCHRATE.#text",
                                                manufacturingDate: "MFDON"
                                            }
                                        }
                                    ],

                                    accounting: [
                                        {
                                            list: "ACCOUNTINGALLOCATIONS.LIST",
                                            item: {
                                                ledger: "LEDGERNAME",
                                                amount: "AMOUNT"
                                            }
                                        }
                                    ]
                                }
                            }
                        ],

                        accounting: [
                            {
                                list: "ACCOUNTINGALLOCATIONS.LIST",
                                item: {
                                    ledger: "LEDGERNAME",
                                    amount: "AMOUNT"
                                }
                            }
                        ],

                        ledger: [
                            {
                                list: "LEDGERENTRIES.LIST",
                                item: {
                                    name: "LEDGERNAME.#text",
                                    amount: "AMOUNT.#text"
                                }
                            }
                        ],

                        allLedger: [
                            {
                                list: "ALLLEDGERENTRIES.LIST",
                                item: {
                                    name: "LEDGERNAME",
                                    amount: "AMOUNT"
                                }
                            }
                        ]
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