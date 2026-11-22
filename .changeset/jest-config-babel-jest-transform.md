---
'@jmlweb/jest-config': minor
---

Transform `.js`/`.jsx` files with `babel-jest` by default. The default `transform` only mapped TypeScript to `ts-jest`, and any explicit `transform` replaces Jest's implicit `babel-jest` default, so JavaScript tests matched by `testMatch` lost `jest.mock` hoisting and the project's Babel config. `babel-jest` is now a peer dependency: install it next to `jest` and `ts-jest` (`npm install --save-dev babel-jest`), since pnpm does not expose Jest's own copy to your project.
