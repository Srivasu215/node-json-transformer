import { IDENTIFIERS } from "./constants.js";
import { resolvePath, isNonEmptyArray } from "./resolve.js";
import { resolveValue } from "./value.js";
import { traverse } from "./traverse.js";

/*
 * An object mapping defines the output keys. Each instruction tells us how
 * to obtain that output value.
 */
const traverseObject = (mapping, source, context) => {
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
            result[outputKey] = startFunc(instruction[0], source, context);
            return;
        }

        if (instruction && typeof instruction === "object") {
            result[outputKey] = traverse(instruction, source, context);
        }
    });

    return result;
};

const collectArray = (items, source, context) => {
    const result = [];

    items.forEach((instruction) => {
        if (typeof instruction === "string") {
            const value = resolveValue(
                instruction,
                source,
                context.rootSource,
                context.configuration
            );
            if (isNonEmptyArray(value)) result.push(...value);
            else result.push(value);
            return;
        }

        if (Array.isArray(instruction)) {
            result.push(...startFunc(instruction[0], source, context));
            return;
        }

        if (instruction && typeof instruction === "object") {
            result.push(traverseObject(instruction, source, context));
        }
    });

    return result;
};

/*
 * Array mappings first locate the source collection and then reuse the same
 * object traversal for every selected item.
 */
const startFunc = (mapping, source, context) => {
    let sourceArray;
    // console.log("aaaaaa : ", mapping);
    if (typeof mapping.list !== "undefined") {
        const key = mapping.list;
        if (
            key.startsWith(IDENTIFIERS.ARRAY_INDEX) &&
            key.includes(IDENTIFIERS.ARRAY_START) &&
            key.includes(IDENTIFIERS.ARRAY_END)
        ) {
            return [traverseObject(mapping.item, source, context)];
        }
        sourceArray = resolvePath(key, source);
    } else if (typeof mapping.objectify !== "undefined") {
        sourceArray = [resolvePath(mapping.objectify, source)];
    } else if (typeof mapping.collect !== "undefined") {
        return collectArray(mapping.item, source, context);
    }

    if (!isNonEmptyArray(sourceArray)) return [];

    return sourceArray.map((item) => {
        return traverseObject(mapping.item, item, context);
    });
};

export default startFunc;