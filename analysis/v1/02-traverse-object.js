import { traverseObject } from "../../src/v4/traverse.js";

const source = {
    x: "xx",
    y: {
        z: "zz"
    }
};

const mapping = {
    a: "x",
    b: "y.z"
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
    mapping,
    source,
    result
}, null, 2));
