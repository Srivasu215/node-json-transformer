import collectArray from "./forMappingCollect/collectArray.js";
import forMappingList from "./forMappingList.js";
import forMappingobjectify from "./forMappingobjectify.js";

/*
 * Array mappings first locate the source collection and then
 * reuse the same object traversal for every selected item.
 *
 * startFunc is intentionally only the orchestrator.
 */
const startFunc = (mapping, source, context) => {
    if (typeof mapping.collect !== "undefined") {
        return collectArray(
            mapping.item,
            source,
            context
        );
    };

    if (typeof mapping.list !== "undefined") {
        return forMappingList(
            mapping,
            source,
            context
        );
    };

    if (typeof mapping.objectify !== "undefined") {
        return forMappingobjectify(
            mapping,
            source,
            context
        );
    };

    return [];
};

export default startFunc;