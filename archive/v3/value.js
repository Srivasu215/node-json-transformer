import { IDENTIFIERS, VALUES } from "./constants.js";
import { getObjectOrArrayFromStringKey } from "./path.js";
import { isSpecialType, performAction, convertToType, extractKeyAndValue } from "./actions.js";

const convertSpecialType = (key, obj, config, convertByKey) => {
    const { keyType, keyVal } = extractKeyAndValue(key);
    const valueByPath = getObjectOrArrayFromStringKey(keyVal, obj);

    if (typeof valueByPath !== "undefined") {
        if (key.indexOf(IDENTIFIERS.TYPE_START) > -1) {
            return convertToType(keyType, valueByPath);
        }

        return performAction(keyType, valueByPath, obj, config, convertByKey);
    }

    return VALUES.DEFAULT;
};

const convertByKey = (key, obj, rootData, configuration) => {
    const specialType = isSpecialType(key);

    if (key.startsWith(IDENTIFIERS.HARD_CODED)) {
        return key.substring(1);
    }

    if (key.startsWith(IDENTIFIERS.PARENT)) {
        const extractedKey = key.substring(1);
        return getObjectOrArrayFromStringKey(extractedKey, rootData);
    }

    if (specialType) {
        return convertSpecialType(key, obj, configuration, (path, data) => {
            return convertByKey(path, data, rootData, configuration);
        });
    }

    return getObjectOrArrayFromStringKey(key, obj);
};

export { convertByKey };
