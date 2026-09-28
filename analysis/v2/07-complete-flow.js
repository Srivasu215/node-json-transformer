import transformer from "../../src/v4/index.js";

const source = {
    customer: {
        name: "Keshav"
    },
    items: [
        { name: "ROPE", amount: 260 },
        { name: "CABLE", amount: 540 }
    ]
};

const transformation = {
    mapping: {
        customer: {
            name: "customer.name"
        },
        products: [
            {
                list: "items",
                item: {
                    name: "name",
                    amount: "amount"
                }
            }
        ]
    }
};

const result = transformer.transform(source, transformation);

console.log(JSON.stringify({
    flow: [
        "transform(source, transformation)",
        "extract mapping",
        "traverse(mapping, source, context)",
        "traverseObject builds the output object",
        "nested object instruction calls traverse again",
        "array instruction calls traverseArray",
        "traverseArray resolves the source list",
        "each source item goes through traverseObject",
        "string instructions reach resolveValue",
        "resolveValue reaches resolvePath"
    ],
    result
}, null, 2));
