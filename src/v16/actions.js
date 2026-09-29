import { IDENTIFIERS } from "./constants.js";
import { resolvePath, isNumber } from "./resolve.js";

const operators = ["+", "-", "*", "/", "%"];

const convertToString = (value) => value ? String(value) : "";
const convertToNumber = (value) => value ? Number(value) : 0;
const convertToUpperCase = (value) => value ? value.toUpperCase() : "";
const convertToDate = (value) => {
    if (!value) return value;
    try {
        return new Date(value).getTime();
    } catch (error) {
        return value;
    }
};

const deleteKey = () => undefined;
const deleteIfNotPresent = (value) => typeof value === "undefined" ? undefined : value;

const typeToFn = {
    STRING: convertToString,
    NUMBER: convertToNumber,
    DATE: convertToDate,
    UPPER: convertToUpperCase
};

const extractSpecial = (key) => {
    const typeStart = key.indexOf(IDENTIFIERS.TYPE_START) > -1
        ? IDENTIFIERS.TYPE_START
        : key.indexOf(IDENTIFIERS.ACTION_START) > -1
            ? IDENTIFIERS.ACTION_START
            : null;

    if (!typeStart) return null;

    const end = typeStart === IDENTIFIERS.TYPE_START
        ? IDENTIFIERS.TYPE_END
        : IDENTIFIERS.ACTION_END;

    return {
        kind: typeStart,
        type: key.substring(key.indexOf(typeStart) + 1, key.lastIndexOf(end)),
        path: key.substring(0, key.indexOf(typeStart))
    };
};

const evaluateExpression = (value, key, source, config) => {
    const resolvedKey = resolvePath(key, source);
    if (!config[resolvedKey]) return resolvedKey;

    const { operator, value: expressionValue } = config[resolvedKey];
    if (!operators.includes(operator) || !isNumber(expressionValue)) {
        return resolvedKey;
    }

    return eval(`${value}${operator}${expressionValue}`);
};

const createActionMap = ({ convertValue }) => ({
    APPEND: (value, key, source, config) => {
        const appendMap = config?.appendMap;
        if (!appendMap || typeof appendMap[key] === "undefined") return value;
        const { path, separator } = appendMap[key];
        return value + (separator || "") + convertValue(path, source);
    },
    DELETE: deleteKey,
    DELETE_IF_NOT_PRESENT: deleteIfNotPresent,
    DEPENDS: (value, key, source, config) => {
        if (typeof key === "undefined") return config.dependentMap[value];
        const nested = extractSpecial(key);
        if (nested && actionMap[nested.type]) {
            return actionMap[nested.type](value, nested.path, source, config);
        }
        return key;
    },
    EVAL: evaluateExpression
});

let actionMap = {};

const convertType = (type, value) => {
    return typeToFn[type] ? typeToFn[type](value) : value;
};

const performAction = (type, value, key, source, config, convertValue) => {
    actionMap = createActionMap({ convertValue });
    const nested = extractSpecial(type);
    if (nested && actionMap[nested.type]) {
        return actionMap[nested.type](value, nested.path, source, config);
    }
    if (actionMap[type]) {
        return actionMap[type](value, undefined, source, config);
    }
    return value;
};

export { convertType, extractSpecial, performAction };
