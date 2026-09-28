import { IDENTIFIERS } from "./constants.js";
import { getObjectOrArrayFromStringKey, isNonEmptyArray } from "./path.js";
import { convertByKey } from "./value.js";

const collectArrayElements = (items, data, context) => {
    let result = [];

    items.forEach((mappingKey) => {
        if (typeof mappingKey === "string") {
            const returnedValue = convertByKey(
                mappingKey,
                data,
                context.rootData,
                context.configuration
            );

            if (isNonEmptyArray(returnedValue)) {
                result = result.concat(returnedValue);
            } else {
                result.push(returnedValue);
            }
            return;
        }

        if (Array.isArray(mappingKey)) {
            result = result.concat(context.convertByArray(mappingKey[0], data));
            return;
        }

        if (typeof mappingKey === "object" && mappingKey !== null) {
            result.push(context.transformObject(mappingKey, data));
        }
    });

    return result;
};

const transformArray = (mapping, data, context) => {
    let sourceArray;

    if (typeof mapping.list !== "undefined") {
        sourceArray = getObjectOrArrayFromStringKey(mapping.list, data);
    } else if (typeof mapping.objectify !== "undefined") {
        sourceArray = [getObjectOrArrayFromStringKey(mapping.objectify, data)];
    } else if (typeof mapping.collect !== "undefined") {
        return collectArrayElements(mapping.item, data, context);
    }

    if (!isNonEmptyArray(sourceArray)) {
        return [];
    }

    return sourceArray.map((value) => {
        return context.transformObject(mapping.item, value);
    });
};

const convertByArray = (mapping, data, context) => {
    const key = mapping.list;

    if (typeof key === "undefined") {
        return transformArray(mapping, data, context);
    }

    if (
        key.startsWith(IDENTIFIERS.ARRAY_INDEX) &&
        key.indexOf(IDENTIFIERS.ARRAY_START) > -1 &&
        key.indexOf(IDENTIFIERS.ARRAY_END) > -1
    ) {
        return [context.transformObject(mapping.item, data)];
    }

    return transformArray(mapping, data, context);
};

export {
    collectArrayElements,
    convertByArray,
    transformArray
};
