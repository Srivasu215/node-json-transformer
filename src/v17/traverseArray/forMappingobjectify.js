import { resolvePath } from "../resolve.js";

import traverseObjectSource from "./traverseObjectSource.js";

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

export default startFunc;