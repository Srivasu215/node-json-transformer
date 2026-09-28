# Current test-target observation

The uploaded repository contains `test/v4/index.js`, but that file currently imports:

```js
../../src/v2/index.js
```

Therefore the existing V4 test file is not currently exercising `src/v4`.

This observation is intentionally not fixed here. It is recorded so future analysis
does not accidentally assume that `test/v4` validates V4.

The dedicated `test/analysis-v1/flow.test.js` imports `src/v4` directly.
