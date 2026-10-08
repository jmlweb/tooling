type Node = {
  type: string;
};

type RuleContext = {
  report: (descriptor: { node: Node; messageId: string }) => void;
};

const noEnum = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow TypeScript enums in favor of const maps',
    },
    messages: {
      noEnum: 'Use const maps instead of enums',
    },
    schema: [],
  },
  create: (context: RuleContext) => ({
    TSEnumDeclaration: (node: Node) => {
      context.report({ node, messageId: 'noEnum' });
    },
  }),
};

/** Oxlint JS plugin with rules that have no native Oxlint equivalent */
const plugin = {
  meta: {
    name: 'jmlweb',
  },
  rules: {
    'no-enum': noEnum,
  },
};

export default plugin;
