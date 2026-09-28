import { convertByKey } from "./value.js";

const transformObject = (obj, data, context) => {
    const transformedObj = {};
    const keys = Object.keys(obj);

    keys.forEach((key) => {
        const mappingKey = obj[key];

        if (typeof mappingKey === "string") {
            transformedObj[key] = convertByKey(
                mappingKey,
                data,
                context.rootData,
                context.configuration
            );
            return;
        }

        if (Array.isArray(mappingKey) && mappingKey.length > 0) {
            transformedObj[key] = context.convertByArray(mappingKey[0], data);
            return;
        }

        if (typeof mappingKey === "object" && mappingKey !== null) {
            transformedObj[key] = context.specialObjectTransformation(mappingKey, data);
        }
    });

    return transformedObj;
};

export { transformObject };
