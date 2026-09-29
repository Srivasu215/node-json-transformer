import { getObjectOrArrayFromStringKey } from "./path.js";
import { transformObject } from "./object.js";
import { convertByArray, transformArray } from "./array.js";

const createEngine = ({ rootData, configuration }) => {
    const context = {
        rootData,
        configuration
    };

    const extractArrayIndexObject = (key, data) => {
        if (key.indexOf("#eq(") > -1) {
            const index = key.substring(
                key.lastIndexOf("#eq(") + 4,
                key.lastIndexOf(")")
            );
            const keyVal = key.substring(0, key.lastIndexOf("#eq("));
            const extractedData = keyVal
                ? getObjectOrArrayFromStringKey(keyVal, data)
                : data;

            return extractedData[index];
        }

        return {};
    };

    const specialObjectTransformation = (mappingKey, data) => {
        if (typeof mappingKey.flat !== "undefined") {
            const extractedData = extractArrayIndexObject(mappingKey.flat, data);
            return transformObject(mappingKey.item, extractedData, context);
        }

        if (typeof mappingKey.objectify !== "undefined") {
            return transformArray(mappingKey, data, context);
        }

        return transformObject(mappingKey, data, context);
    };

    context.transformObject = (mapping, data) => {
        return transformObject(mapping, data, context);
    };

    context.transformArray = (mapping, data) => {
        return transformArray(mapping, data, context);
    };

    context.convertByArray = (mapping, data) => {
        return convertByArray(mapping, data, context);
    };

    context.specialObjectTransformation = specialObjectTransformation;

    return context;
};

export { createEngine };
