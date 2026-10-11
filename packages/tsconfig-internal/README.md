# @jmlweb/tsconfig-internal

> Private TypeScript configuration for building the monorepo's own packages. Not published to npm; external projects should use [`@jmlweb/tsconfig-base`](../tsconfig-base).

## Usage

```json
{
  "extends": "@jmlweb/tsconfig-internal",
  "include": ["src"]
}
```

## Configuration

Standalone (does not extend another config), tuned for packages built with tsdown.

| Option                                                 | Value                |
| ------------------------------------------------------ | -------------------- |
| `target`                                               | `ES2022`             |
| `module` / `moduleResolution`                          | `ESNext` / `bundler` |
| `strict`, `isolatedModules`, `verbatimModuleSyntax`    | `true`               |
| `declaration`, `declarationMap`                        | `true`               |
| `esModuleInterop`, `skipLibCheck`, `resolveJsonModule` | `true`               |
| `rootDir`                                              | `${configDir}/src`   |
| `outDir`                                               | `dist`               |

`rootDir` and `outDir` resolve per package, so sources must live in `src/`. No `include`/`exclude` is set; each package defines its own.

## License

MIT
