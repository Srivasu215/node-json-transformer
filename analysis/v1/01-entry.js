import transformer from "../../src/v4/index.js";

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
            b: "y.z"
        }
    }
};

const result = transformer.transform(source, transformation);

console.log(JSON.stringify({
    source,
    transformation,
    result
}, null, 2));
