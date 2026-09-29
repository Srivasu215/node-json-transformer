import traverseObjectSource from "./traverseObjectSource.js";
import traverseArraySource from "./traverseArraySource.js";

function isPlainObject(value) {
    return (
        value !== null &&
        typeof value === "object" &&
        Object.getPrototypeOf(value) === Object.prototype
    );
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
const startFunc = (
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

export default startFunc;