import { resolvePath } from "../../src/v4/resolve.js";

const source = {
    customer: {
        address: {
            city: "Yamuna Nagar"
        }
    },
    "ALLINVENTORYENTRIES.LIST": [
        {
            STOCKITEMNAME: "ROPE"
        }
    ]
};

const result = {
    normalPath: resolvePath(
        "customer.address.city",
        source
    ),
    dottedLiteralKey: resolvePath(
        "ALLINVENTORYENTRIES.LIST",
        source
    ),
    nestedDottedPath: resolvePath(
        "ALLINVENTORYENTRIES.LIST.STOCKITEMNAME",
        source
    )
};

console.log(JSON.stringify(result, null, 2));
