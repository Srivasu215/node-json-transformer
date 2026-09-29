import traverseObject from "../traverseObject.js";

/*
 * Traverse a source array using the supplied item mapping.
 */
const startFunc = (
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

export default startFunc;