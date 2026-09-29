import { IDENTIFIERS } from "./constants.js";
import { resolvePath, isNonEmptyArray } from "./resolve.js";
import { resolveValue } from "./value.js";
import { traverse } from "./traverse.js";

function isPlainObject(value) {
    return (
        value !== null &&
        typeof value === "object" &&
        Object.getPrototypeOf(value) === Object.prototype
    );
}

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
            result[outputKey] = startFunc(
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

/*
 * Determines whether the list mapping represents an explicit
 * array-index mapping.
 */
const isArrayIndexMapping = (mapping) => {
    const key = mapping.list;

    return (
        key.startsWith(IDENTIFIERS.ARRAY_INDEX) &&
        key.includes(IDENTIFIERS.ARRAY_START) &&
        key.includes(IDENTIFIERS.ARRAY_END)
    );
};

/*
 * An item mapping may be wrapped in an array.
 * The traversal itself works with the actual mapping object.
 */
const getItemMapping = (mapping) => {
    return Array.isArray(mapping.item)
        ? mapping.item[0]
        : mapping.item;
};

/*
 * Resolve a normal list source.
 */
const resolveListSource = (mapping, source) => {
    return resolvePath(
        mapping.list,
        source
    );
};

/*
 * Resolve an objectify source.
 */
const resolveObjectifySource = (mapping, source) => {
    return resolvePath(
        mapping.objectify,
        source
    );
};

/*
 * Traverse a source array using the supplied item mapping.
 */
const traverseArraySource = (
    sourceArray,
    itemMapping,
    context
) => {
    return sourceArray.map((item) => {
        return traverseObject(
            itemMapping,
            item,
            context
        );
    });
};

/*
 * Traverse a source object as a single array element.
 */
const traverseObjectSource = (
    sourceObject,
    itemMapping,
    context
) => {
    return [
        traverseObject(
            itemMapping,
            sourceObject,
            context
        )
    ];
};

/*
 * Normalize source cardinality before traversal.
 *
 * Tally can represent the same LIST as:
 *
 * ""
 * {}
 * []
 *
 * The mapping declares the desired array output.
 */
const traverseSource = (
    source,
    itemMapping,
    context
) => {
    if (Array.isArray(source)) {
        return traverseArraySource(
            source,
            itemMapping,
            context
        );
    }

    if (isPlainObject(source)) {
        return traverseObjectSource(
            source,
            itemMapping,
            context
        );
    }

    return [];
};

/*
 * Array mappings first locate the source collection and then
 * reuse the same object traversal for every selected item.
 *
 * startFunc is intentionally only the orchestrator.
 */
const startFunc = (mapping, source, context) => {
    if (typeof mapping.collect !== "undefined") {
        return collectArray(
            mapping.item,
            source,
            context
        );
    }

    if (typeof mapping.list !== "undefined") {
        const itemMapping = getItemMapping(mapping);

        if (isArrayIndexMapping(mapping)) {
            return [
                traverseObject(
                    itemMapping,
                    source,
                    context
                )
            ];
        }

        const sourceArray = resolveListSource(
            mapping,
            source
        );

        return traverseSource(
            sourceArray,
            itemMapping,
            context
        );
    }

    if (typeof mapping.objectify !== "undefined") {
        const sourceObject = resolveObjectifySource(
            mapping,
            source
        );

        return traverseObjectSource(
            sourceObject,
            getItemMapping(mapping),
            context
        );
    }

    return [];
};

export default startFunc;