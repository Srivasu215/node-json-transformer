import { IDENTIFIERS, VALUES } from "./constants.js";
import { resolvePath } from "./resolve.js";
import { convertType, extractSpecial, performAction } from "./actions.js";

const resolveValue = (mappingValue, source, rootSource, configuration) => {
    if (mappingValue.startsWith(IDENTIFIERS.HARD_CODED)) {
        return mappingValue.substring(1);
    }

    if (mappingValue.startsWith(IDENTIFIERS.PARENT)) {
        return resolvePath(mappingValue.substring(1), rootSource);
    }

    const special = extractSpecial(mappingValue);
    if (!special) {
        return resolvePath(mappingValue, source);
    }

    const value = resolvePath(special.path, source);
    if (typeof value === "undefined") return VALUES.DEFAULT;

    if (special.kind === IDENTIFIERS.TYPE_START) {
        return convertType(special.type, value);
    }

    return performAction(
        special.type,
        value,
        special.path,
        source,
        configuration,
        (path, data) => resolveValue(path, data, rootSource, configuration)
    );
};

export { resolveValue };
