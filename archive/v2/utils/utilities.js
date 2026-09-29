/**
 * JSON Transformer V2 utilities.
 * Includes literal dotted-key resolution for Tally-style JSON keys.
 */

import { VALUES } from './constants.js';

const getObjectOrArrayFromStringKey1 = (path, obj) => {

    if (path === "") {
        return obj;
    }

    path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    path = path.replace(/^\./, '');           // strip a leading dot
    let pathArray = path.split('.');
    for (let i = 0, n = pathArray.length; i < n; ++i) {
        let currentPath = pathArray[i];
        if (typeof obj === "object" && obj.hasOwnProperty(currentPath) && (currentPath in obj)) {
            obj = obj[currentPath];
        } else if (Array.isArray(obj)) {
            // create nested path for array traversal
            currentPath = pathArray.slice(i, pathArray.length).join(".");
            return obj.map((val) => {
                return getObjectOrArrayFromStringKey(currentPath, val);
            })
        } else {
            return VALUES.DEFAULT;
        }

    }
    return obj;

};

const getObjectOrArrayFromStringKey = (path, obj) => {
    if (path === "") {
        return obj;
    }

    path = path.replace(/\[(\w+)\]/g, '.$1');
    path = path.replace(/^\./, '');

    const pathArray = path.split('.');

    for (let i = 0; i < pathArray.length;) {
        if (Array.isArray(obj)) {
            const currentPath = pathArray
                .slice(i)
                .join('.');

            return obj.map((val) => {
                return getObjectOrArrayFromStringKey(
                    currentPath,
                    val
                );
            });
        }

        if (typeof obj !== "object" || obj === null) {
            return VALUES.DEFAULT;
        }

        let matchedKey;
        let matchedLength = 0;

        for (let j = pathArray.length; j > i; j--) {
            const candidate = pathArray
                .slice(i, j)
                .join('.');

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

const isNonEmptyArray = (arr) => {
    return arr && Array.isArray(arr) && arr.length > 0;
};

const isNumber = (x) => {
    return !isNaN(x);
};

const utilities = {
    getObjectOrArrayFromStringKey,
    getObjectOrArrayFromStringKey1,
    isNonEmptyArray,
    isNumber
};

export {
    getObjectOrArrayFromStringKey,
    getObjectOrArrayFromStringKey1,
    isNonEmptyArray,
    isNumber
};
export default utilities;
