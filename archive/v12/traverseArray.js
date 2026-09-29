import { IDENTIFIERS } from "./constants.js";
import { resolvePath, isNonEmptyArray } from "./resolve.js";
import { resolveValue } from "./value.js";
import { traverse } from "./traverse.js";

function isPlainObject(value) {
    return value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;
};
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
const startFunc1 = (mapping, source, context) => {
    let sourceArray;
    // console.log("aaaaaa : ", mapping);
    // console.log("aaaaaa : ", mapping, source, context);

    if (typeof mapping.list !== "undefined") {
        const key = mapping.list;


        if (
            key.startsWith(IDENTIFIERS.ARRAY_INDEX) &&
            key.includes(IDENTIFIERS.ARRAY_START) &&
            key.includes(IDENTIFIERS.ARRAY_END)
        ) {
            const fromObject = traverseObject(mapping.item, source, context);
            // console.log("aaaaaa  2 : ", fromObject);
            return [fromObject];
        };
        sourceArray = resolvePath(key, source);

    } else if (typeof mapping.objectify !== "undefined") {
        sourceArray = [resolvePath(mapping.objectify, source)];
    } else if (typeof mapping.collect !== "undefined") {
        return collectArray(mapping.item, source, context);
    };

    if (Array.isArray(mapping.item)) {
        const isObject = isPlainObject(sourceArray);

        if (isObject) {
            // const fromTraverse = traverseObject(mapping.item, sourceArray, context);
            return [sourceArray];
            // console.log("-----  0 : ", fromTraverse);
        };

        // console.log("-----  0 : ", isObject);
        // console.log("aaaaaa  1 : ", sourceArray, key, mapping.item);
        // console.log("-----  1 : ", sourceArray);
        // const fromTraverse = traverseObject(mapping.item, item, context);
        // console.log("-----  2 : ", fromTraverse);
        // return fromTraverse;

        // return sourceArray.map((item) => {

        // });
    };

    if (!isNonEmptyArray(sourceArray)) return [];

    return sourceArray.map((item) => {
        return traverseObject(mapping.item, item, context);
    });
};

const startFunc = (mapping, source, context) => {
    let sourceArray;

    if (typeof mapping.list !== "undefined") {
        const key = mapping.list;

        if (
            key.startsWith(IDENTIFIERS.ARRAY_INDEX) &&
            key.includes(IDENTIFIERS.ARRAY_START) &&
            key.includes(IDENTIFIERS.ARRAY_END)
        ) {
            const fromObject = traverseObject(
                Array.isArray(mapping.item)
                    ? mapping.item[0]
                    : mapping.item,
                source,
                context
            );

            return [fromObject];
        }

        sourceArray = resolvePath(key, source);

    } else if (typeof mapping.objectify !== "undefined") {
        sourceArray = [resolvePath(mapping.objectify, source)];

    } else if (typeof mapping.collect !== "undefined") {
        return collectArray(mapping.item, source, context);
    }

    const itemMapping = Array.isArray(mapping.item)
        ? mapping.item[0]
        : mapping.item;

    if (Array.isArray(sourceArray)) {
        return sourceArray.map((item) => {
            return traverseObject(
                itemMapping,
                item,
                context
            );
        });
    }

    if (isPlainObject(sourceArray)) {
        return [
            traverseObject(
                itemMapping,
                sourceArray,
                context
            )
        ];
    }

    return [];
};

export default startFunc;