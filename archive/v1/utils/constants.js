/**
 * Created by sudhir.m on 23/03/17.
 */

const IDENTIFIERS = {
    PARENT: "^",
    ARRAY_INDEX: "#",
    ARRAY_START: "(",
    ARRAY_END: ")",
    TYPE_START: "(",
    TYPE_END: ")",
    ACTION_START: "{",
    ACTION_END: "}",
    HARD_CODED: "$"
};

const VALUES = {
    DEFAULT: undefined
};

const Constants = {
    IDENTIFIERS,
    VALUES
};

export { IDENTIFIERS, VALUES };
export default Constants;
