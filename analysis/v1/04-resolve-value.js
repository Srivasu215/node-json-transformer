import { resolveValue } from "../../src/v4/value.js";

const source = {
    x: "xx",
    number: "123"
};

const context = {
    rootSource: source,
    configuration: {}
};

const result = {
    normal: resolveValue("x", source, source, {}),
    hardCoded: resolveValue("$India", source, source, {}),
    number: resolveValue("number(NUMBER)", source, source, {})
};

console.log(JSON.stringify(result, null, 2));
