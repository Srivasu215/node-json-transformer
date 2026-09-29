import transform from "../../../src/index.js";

import source from './02-source.json' with {type: 'json'};
import template from './01-template.json' with {type: 'json'};

const actual = transform.transform(source, template);

console.log(JSON.stringify(actual, null, 2));
