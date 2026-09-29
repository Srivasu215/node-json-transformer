/**
 * JSON Transformer V5
 *
 * Source is the data.
 * Transformation is the output recipe.
 *
 * The transformation is traversed recursively. String instructions resolve
 * values from the current source object; object instructions recurse into
 * another mapping; array instructions select and transform source arrays.
 */

import { traverse } from "./traverse.js";

const transform = (inData, inTransformation) => {
    let source = inData;
    let transformation = inTransformation;

    if (
        inData !== null &&
        typeof inData === "object" &&
        "inData" in inData &&
        inTransformation === undefined
    ) {
        source = inData.inData;
        transformation = inData.inTransformation;
    }

    const { mapping, config = {} } = transformation;

    return traverse(mapping, source, {
        rootSource: source,
        configuration: config
    });
};

const transformHelper = { transform };

export { transform };
export default transformHelper;
