/**
 * JSON Transformer V3
 *
 * The implementation is organized around the capabilities already present
 * in the transformer: path resolution, value conversion, object transformation,
 * array transformation, and actions.
 */

import { createEngine } from "./engine.js";

const transform = (inData, inTransformation) => {
    let localData = inData;
    let localTransformation = inTransformation;

    if (
        inData !== null &&
        typeof inData === "object" &&
        "inData" in inData &&
        inTransformation === undefined
    ) {
        localData = inData.inData;
        localTransformation = inData.inTransformation;
    }

    const { mapping, config } = localTransformation;
    const engine = createEngine({
        rootData: localData,
        configuration: config || {}
    });

    if (
        typeof mapping.list !== "undefined" ||
        typeof mapping.objectify !== "undefined" ||
        typeof mapping.collect !== "undefined"
    ) {
        return engine.transformArray(mapping, localData);
    }

    if (typeof mapping.flat !== "undefined") {
        const index = mapping.flat.lastIndexOf("#eq(");
        const keyVal = mapping.flat.substring(0, index);
        const position = mapping.flat.substring(index + 4, mapping.flat.lastIndexOf(")"));
        const extractedData = keyVal
            ? engine.transformObject({ value: keyVal }, localData).value
            : localData;

        return engine.transformObject(mapping.item, extractedData[position]);
    }

    return engine.transformObject(mapping.item, localData);
};

const transformHelper = {
    transform
};

export { transform };
export default transformHelper;
