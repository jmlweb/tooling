---
id: RPT-005
title: createJestConfig default transform drops babel-jest for the .js/.jsx tests it matches
type: bug
severity: medium
status: triaged
created: 2026-11-11
triaged: 2026-11-11
task-id: TSK-005
---

## Summary

`createJestConfig()` matches `.js` and `.jsx` test files by default but its default `transform` only covers TypeScript. Setting `transform` at all replaces Jest's implicit `babel-jest` default, so `.js`/`.jsx` files are no longer transformed: `jest.mock()` calls are not hoisted above `require`, and any Babel config (for example JSX) the project has is ignored.

## Location

- `packages/jest-config/src/index.ts:105-106`: default `moduleFileExtensions` and `testMatch` include `js` and `jsx`
- `packages/jest-config/src/index.ts:138-148`: default `transform` maps only `^.+\\.tsx?$` to `ts-jest`
- `packages/jest-config/README.md:94`: documents the transform as ts-jest for `.ts`/`.tsx` only; nothing warns that JS tests lose babel-jest

## Reproduction

Temp project in `/tmp` with Jest 30.5.2 and ts-jest from the repo's store:

`dep.js`:

```js
module.exports = { value: 'real' };
```

`hoist.test.js`:

```js
const dep = require('./dep');
jest.mock('./dep', () => ({ value: 'mocked' }));
test('jest.mock is hoisted above require', () => {
  expect(dep.value).toBe('mocked');
});
```

- Plain Jest (`module.exports = {}`): `Tests: 1 passed, 1 total`
- `createJestConfig()` written to JSON and passed with `--config`:

```text
    Expected: "mocked"
    Received: "real"
Tests:       1 failed, 1 total
```

## Expected

The default config keeps `babel-jest` for the JS extensions it matches, for example by adding `'^.+\\.[jt]sx?$'`-style coverage or an explicit `'^.+\\.jsx?$': 'babel-jest'` entry, so JS tests behave as under plain Jest.
