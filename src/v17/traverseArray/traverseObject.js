import { resolveValue } from "../value.js";
import { traverse } from "../traverse.js";
import traverseArray from "./index.js";

/*
 * An object mapping defines the output keys. Each instruction tells us how
 * to obtain that output value.
 */
const startFunc = (mapping, source, context) => {
    const result = {};

    Object.keys(mapping).forEach((outputKey) => {
        const instruction = mapping[outputKey];

        if (typeof instruction === "string") {
            result[outputKey] = resolveValue(
                instruction,
                source,
                context.rootSource,
                context.configuration
            );
            return;
        }

        if (Array.isArray(instruction) && instruction.length > 0) {
            result[outputKey] = traverseArray(
                instruction[0],
                source,
                context
            );
            return;
        }

        if (instruction && typeof instruction === "object") {
            result[outputKey] = traverse(
                instruction,
                source,
                context
            );
        }
    });

    return result;
};

export default startFunc;