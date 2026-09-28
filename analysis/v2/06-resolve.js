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

console.log(JSON.stringify({
    normalPath: resolvePath(
        "customer.address.city",
        source
    ),
    dottedLiteralKey: resolvePath(
        "ALLINVENTORYENTRIES.LIST",
        source
    ),
    dottedPathIntoArray: resolvePath(
        "ALLINVENTORYENTRIES.LIST.STOCKITEMNAME",
        source
    )
}, null, 2));
