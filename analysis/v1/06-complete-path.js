import { transform } from "../../src/v4/index.js";

const source = {
    x: "xx",
    y: {
        z: "zz"
    }
};

const transformation = {
    mapping: {
        item: {
            a: "x",
            nested: {
                value: "y.z"
            }
        }
    }
};

console.log(JSON.stringify({
    step1: "transform receives source + transformation",
    step2: "mapping.item becomes the object instruction",
    step3: "traverseObject visits a",
    step4: "resolveValue resolves x",
    step5: "traverseObject visits nested",
    step6: "traverse enters nested object",
    step7: "resolveValue resolves y.z",
    output: transform(source, transformation)
}, null, 2));
