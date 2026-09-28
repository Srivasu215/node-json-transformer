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
    sourceArray: "items",
    operation: "resolve list -> map each source item -> traverseObject(item)",
    result
}, null, 2));
