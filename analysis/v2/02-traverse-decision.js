import { traverse } from "../../src/v4/traverse.js";

const source = {
    x: "xx"
};

const context = {
    rootSource: source,
    configuration: {}
};

const mappings = {
    plainObject: {
        a: "x"
    },
    itemObject: {
        item: {
            a: "x"
        }
    },
    listArray: {
        list: "items",
        item: {
            a: "x"
        }
    }
};

const arraySource = {
    items: [
        { x: "one" },
        { x: "two" }
    ]
};

console.log(JSON.stringify({
    plainObject: traverse(mappings.plainObject, source, context),
    itemObject: traverse(mappings.itemObject, source, context),
    listArray: traverse(
        mappings.listArray,
        arraySource,
        {
            rootSource: arraySource,
            configuration: {}
        }
    )
}, null, 2));
