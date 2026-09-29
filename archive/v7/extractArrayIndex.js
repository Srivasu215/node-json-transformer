import { IDENTIFIERS } from "./constants.js";
import { resolvePath } from "./resolve.js";

const startFunc = (key, source) => {
    if (!key.includes(IDENTIFIERS.ARRAY_INDEX)) return {};

    const indexStart = key.lastIndexOf(IDENTIFIERS.ARRAY_INDEX) + 4;
    const indexEnd = key.lastIndexOf(IDENTIFIERS.ARRAY_END);
    const index = key.substring(indexStart, indexEnd);
    const path = key.substring(0, key.lastIndexOf(IDENTIFIERS.ARRAY_INDEX));
    const value = path ? resolvePath(path, source) : source;

    return value?.[index];
};

export default startFunc;
