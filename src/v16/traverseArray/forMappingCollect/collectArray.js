import { isNonEmptyArray } from "../../resolve.js";
import { resolveValue } from "../../value.js";
import traverseObject from "../../traverseObject.js";

const startFunc = (items, source, context) => {
    const result = [];

    items.forEach((instruction) => {
        if (typeof instruction === "string") {
            const value = resolveValue(
                instruction,
                source,
                context.rootSource,
                context.configuration
            );

            if (isNonEmptyArray(value)) {
                result.push(...value);
            } else {
                result.push(value);
            }

            return;
        }

        if (Array.isArray(instruction)) {
            result.push(
                ...startFunc(
                    instruction[0],
                    source,
                    context
                )
            );
            return;
        }

        if (instruction && typeof instruction === "object") {
            result.push(
                traverseObject(
                    instruction,
                    source,
                    context
                )
            );
        }
    });

    return result;
};

export default startFunc;