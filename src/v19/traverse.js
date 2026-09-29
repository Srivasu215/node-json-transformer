import traverseArray from "./traverseArray/index.js";
import extractArrayIndex from "./extractArrayIndex.js";

import traverseObject from "./traverseObject.js";

/*
 * Mapping traversal decides what the current mapping node means.
 * It never searches the source by itself; source lookup belongs to resolve.js.
 */
const traverse = (mapping, source, context) => {
    // console.log("aaaaaa : ", mapping);

    if (
        typeof mapping.list !== "undefined" ||
        typeof mapping.objectify !== "undefined" ||
        typeof mapping.collect !== "undefined"
    ) {
        return traverseArray(mapping, source, context);
    }

    if (typeof mapping.flat !== "undefined") {
        const extracted = extractArrayIndex(mapping.flat, source);
        return traverseObject(mapping.item, extracted, context);
    }

    if (typeof mapping.item !== "undefined") {
        return traverseObject(mapping.item, source, context);
    }

    return traverseObject(mapping, source, context);
};

export { traverse };