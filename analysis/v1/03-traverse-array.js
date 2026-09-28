import { traverseArray } from "../../src/v4/traverse.js";

const source = {
    items: [
        { name: "one" },
        { name: "two" }
    ]
};

const mapping = {
    list: "items",
    item: {
        name: "name"
    }
};

const result = traverseArray(
    mapping,
    source,
    {
        rootSource: source,
        configuration: {}
    }
);

console.log(JSON.stringify({
    mapping,
    source,
    result
}, null, 2));
