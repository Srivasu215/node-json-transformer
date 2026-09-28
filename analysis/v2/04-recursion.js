import { traverseObject } from "../../src/v4/traverse.js";

const source = {
    customer: {
        address: {
            city: "Yamuna Nagar"
        }
    }
};

const mapping = {
    customer: {
        address: {
            city: "customer.address.city"
        }
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
    mapping,
    result,
    recursion: "object instruction -> traverse(instruction, source, context)"
}, null, 2));
