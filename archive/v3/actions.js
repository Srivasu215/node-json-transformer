import { IDENTIFIERS, VALUES } from "./constants.js";
import { getObjectOrArrayFromStringKey, isNumber } from "./path.js";

const operators = ["+", "-", "*", "/", "%"];

const convertToString = (value) => {
    if (value) {
        return String(value);
    }
    return "";
};

const convertToNumber = (value) => {
    if (value) {
        return Number(value);
    }
    return 0;
};

const convertToUpperCase = (value) => {
    if (value) {
        return value.toUpperCase();
    }
    return "";
};

const convertToDate = (value) => {
    if (value) {
        try {
            return new Date(value).getTime();
        } catch (error) {
        }
    }
    return value;
};

const deleteKey = () => {
    return undefined;
};

const deleteIfNotPresent = (value) => {
    return typeof value === "undefined" ? undefined : value;
};

const appendKeyData = (value, key, obj, config, convertByKey) => {
    const { appendMap } = config;

    if (!appendMap || typeof appendMap[key] === "undefined") {
        return value;
    }

    const { path, separator } = appendMap[key];

    return value + (separator ? separator : "") + convertByKey(path, obj);
};

const dependsOnSomeOtherKey = (value, key, obj, config, convertByKey) => {
    if (typeof key === "undefined") {
        return config.dependentMap[value];
    }

    const { keyType, keyVal } = extractKeyAndValue(key);

    if (actionToFnMapping[keyVal]) {
        const actionFn = actionToFnMapping[keyVal];
        return actionFn(value, keyType, obj, config.dependentMap, convertByKey);
    }

    return key;
};

const evaluateExpression = (value, key, obj, config) => {
    key = getObjectOrArrayFromStringKey(key, obj);

    if (!config[key]) {
        return key;
    }

    const { operator, value: expressionValue } = config[key];

    if (operators.indexOf(operator) === -1 || !isNumber(expressionValue)) {
        return key;
    }

    const expression = value + "" + operator + "" + expressionValue;
    return eval(expression);
};

const extractKeyAndValue = (key) => {
    const start = isSpecialType(key);
    const { end } = identifierMap[start];

    const keyType = key.substring(key.indexOf(start) + 1, key.lastIndexOf(end));
    const keyVal = key.substring(0, key.indexOf(start));

    return { keyType, keyVal };
};

const typeToFnMapping = {
    STRING: convertToString,
    NUMBER: convertToNumber,
    DATE: convertToDate,
    UPPER: convertToUpperCase
};

const actionToFnMapping = {
    APPEND: appendKeyData,
    DELETE: deleteKey,
    DELETE_IF_NOT_PRESENT: deleteIfNotPresent,
    DEPENDS: dependsOnSomeOtherKey,
    EVAL: evaluateExpression
};

const convertToType = (type, value) => {
    if (typeToFnMapping[type]) {
        return typeToFnMapping[type](value);
    }

    return value;
};

const performNestedAction = (key, value, obj, config, convertByKey) => {
    const { keyType, keyVal } = extractKeyAndValue(key);

    if (actionToFnMapping[keyVal]) {
        return actionToFnMapping[keyVal](value, keyType, obj, config, convertByKey);
    }
};

const performAction = (type, value, obj, config, convertByKey) => {
    const specialType = isSpecialType(type);

    if (specialType) {
        return performNestedAction(type, value, obj, config, convertByKey);
    }

    if (actionToFnMapping[type]) {
        return actionToFnMapping[type](value, undefined, obj, config, convertByKey);
    }

    return value;
};

const identifierMap = {
    [IDENTIFIERS.TYPE_START]: {
        end: IDENTIFIERS.TYPE_END
    },
    [IDENTIFIERS.ACTION_START]: {
        end: IDENTIFIERS.ACTION_END
    }
};

const isSpecialType = (key) => {
    const keys = Object.keys(identifierMap);

    for (let i = 0; i < keys.length; i++) {
        const start = keys[i];
        const end = identifierMap[start].end;

        if (key.indexOf(start) > -1 && key.indexOf(end) > -1) {
            return start;
        }
    }

    return VALUES.DEFAULT;
};

export {
    actionToFnMapping,
    convertToType,
    extractKeyAndValue,
    identifierMap,
    isSpecialType,
    performAction
};
