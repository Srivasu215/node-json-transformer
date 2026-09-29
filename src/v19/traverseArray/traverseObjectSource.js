import traverseObject from "../traverseObject.js";

/*
 * Traverse a source object as a single array element.
 */
const startFunc = (
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

export default startFunc;