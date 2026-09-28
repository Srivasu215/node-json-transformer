import { traverseObject } from "../../src/v4/traverse.js";

const source = {
    x: "xx",
    y: {
        z: "zz"
    }
};

const mapping = {
    first: "x",
    second: "y.z",
    nested: {
        value: "x"
    }
};

const result = traverseObject(
    mapping,
    source,
    {
        rootSource: source,
        configuration: {}
    }
);

console.log(JSON.stringify({
    observation: [
        "traverseObject creates result",
        "each mapping key becomes an output key",
        "string instructions resolve a source value",
        "object instructions call traverse again"
    ],
    result
}, null, 2));
