/**
 * JSON Transformer V4
 *
 * The source JSON is the data. The transformation JSON describes how that
 * data is traversed and how the result is constructed.
 *
 * V4 makes that mechanism explicit: `traverse.js` owns transformation
 * traversal, while `resolve.js` owns source-path traversal.
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
