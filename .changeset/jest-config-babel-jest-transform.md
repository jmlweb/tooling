---
'@jmlweb/jest-config': minor
---

Transform `.js`/`.jsx` files with `babel-jest` by default. The explicit `transform` replaced Jest's implicit babel-jest default, so JavaScript tests lost `jest.mock` hoisting and the project Babel config. `babel-jest` is now a peer dependency.
