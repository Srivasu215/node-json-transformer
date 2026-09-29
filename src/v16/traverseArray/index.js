import { IDENTIFIERS } from "../constants.js";
import { resolvePath } from "../resolve.js";
import traverseObject from "./traverseObject.js";
import collectArray from "./collectArray.js";

import traverseSource from "./traverseSource.js";
import traverseObjectSource from "./traverseObjectSource.js";

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
    };

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
    };

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
    };

    return [];
};

export default startFunc;