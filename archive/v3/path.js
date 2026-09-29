import { VALUES } from "./constants.js";

const getObjectOrArrayFromStringKey = (path, obj) => {
    if (path === "") {
        return obj;
    }

    path = path.replace(/\[(\w+)\]/g, ".$1");
    path = path.replace(/^\./, "");

    const pathArray = path.split(".");

    for (let i = 0; i < pathArray.length;) {
        if (Array.isArray(obj)) {
            const currentPath = pathArray.slice(i).join(".");

            return obj.map((value) => {
                return getObjectOrArrayFromStringKey(currentPath, value);
            });
        }

        if (typeof obj !== "object" || obj === null) {
            return VALUES.DEFAULT;
        }

        let matchedKey;
        let matchedLength = 0;

        for (let j = pathArray.length; j > i; j--) {
            const candidate = pathArray.slice(i, j).join(".");

            if (Object.prototype.hasOwnProperty.call(obj, candidate)) {
                matchedKey = candidate;
                matchedLength = j - i;
                break;
            }
        }

        if (matchedKey === undefined) {
            return VALUES.DEFAULT;
        }

        obj = obj[matchedKey];
        i += matchedLength;
    }

    return obj;
};

const isNonEmptyArray = (value) => {
    return value && Array.isArray(value) && value.length > 0;
};

const isNumber = (value) => {
    return !isNaN(value);
};

export {
    getObjectOrArrayFromStringKey,
    isNonEmptyArray,
    isNumber
};
