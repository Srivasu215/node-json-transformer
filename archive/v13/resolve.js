import { VALUES } from "./constants.js";

/**
 * Resolve a value from the current source object.
 *
 * A path can be a normal dotted path (`customer.address.city`) or contain
 * literal keys that themselves contain dots (`ALLINVENTORYENTRIES.LIST`).
 */
const resolvePath = (path, source) => {
    if (path === "") {
        return source;
    }

    const normalizedPath = path
        .replace(/\[(\w+)\]/g, ". $1".replace(" ", ""))
        .replace(/^\./, "");

    const parts = normalizedPath.split(".");

    for (let index = 0; index < parts.length;) {
        if (Array.isArray(source)) {
            const remainingPath = parts.slice(index).join(".");
            return source.map((item) => resolvePath(remainingPath, item));
        }

        if (typeof source !== "object" || source === null) {
            return VALUES.DEFAULT;
        }

        let matchedKey;
        let matchedLength = 0;

        for (let end = parts.length; end > index; end -= 1) {
            const candidate = parts.slice(index, end).join(".");

            if (Object.prototype.hasOwnProperty.call(source, candidate)) {
                matchedKey = candidate;
                matchedLength = end - index;
                break;
            }
        }

        if (matchedKey === undefined) {
            return VALUES.DEFAULT;
        }

        source = source[matchedKey];
        index += matchedLength;
    }

    return source;
};

const isNonEmptyArray = (value) => {
    return value && Array.isArray(value) && value.length > 0;
};

const isNumber = (value) => {
    return !isNaN(value);
};

export { resolvePath, isNonEmptyArray, isNumber };
