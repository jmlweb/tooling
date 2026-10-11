# Package READMEs

Every `packages/*/README.md` follows one fixed structure. Full guide: [`docs/README-STANDARDS.md`](../docs/README-STANDARDS.md). Copy [`docs/README-TEMPLATE.md`](../docs/README-TEMPLATE.md) for new packages.

## Section order

1. Title and Badges (`# @jmlweb/name`)
2. Description (one-line blockquote)
3. `## ✨ Features`
4. `## 📦 Installation`
5. `## 🚀 Quick Start`
6. `## 💡 Examples`
7. `## 📋 Configuration Details`
8. `## 🎯 When to Use`
9. `## 🔧 Extending the Configuration`
10. `## 📝 Usage with Scripts`
11. `## 📋 Requirements`
12. `## 📦 Peer Dependencies`
13. `## 🔗 Related Packages`
14. `## 🔄 Migration Guide` (only for breaking changes)
15. `## 📄 License` (`MIT`, last)

## Rules

- Never skip or reorder sections
- Badges: npm version, MIT license, Node.js minimum from `engines.node`
- Install with `npm install --save-dev`, listing every peer dependency
- Every code block has a language tag; examples are complete and runnable
- Monorepo links are relative (`../name`)
- Versions, peers and requirements match `package.json`
- English only
- Update the README in the same change as the code

## Validate

- `pnpm validate:docs`
- `node scripts/validate-package.mjs packages/<name>`
