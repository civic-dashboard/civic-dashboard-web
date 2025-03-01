/* eslint-disable ban-councillor-typo/ban-councillor-typo */
const properSpelling = 'Councillor';
const typos = ['councilor', 'concilor', 'concillor'];

function matchCase(inputText, desiredText) {
  if (inputText === inputText.toLocaleLowerCase())
    return desiredText.toLocaleLowerCase();
  if (inputText === inputText.toLocaleUpperCase())
    return desiredText.toLocaleUpperCase();
  return desiredText;
}

const rules = {
  'ban-councillor-typo': {
    meta: {
      fixable: 'code',
      type: 'problem',
      schema: [],
    },
    create: function (context) {
      function findTyposForNode(node, nodeText, offset = 0) {
        const nameLowerCase = nodeText.toLocaleLowerCase();
        for (const typo of typos) {
          const startIndex = nameLowerCase.indexOf(typo);
          if (startIndex < 0) continue;
          const endIndex = startIndex + typo.length;
          const exactTypo = nodeText.substring(startIndex, endIndex);
          const caseMatchingCouncillor = matchCase(exactTypo, properSpelling);
          context.report({
            node: node,
            message: 'Typo in "{{word}}"',
            data: { word: caseMatchingCouncillor },
            fix(fixer) {
              const nodeStart = node.range[0] + offset;
              return fixer.replaceTextRange(
                [nodeStart + startIndex, nodeStart + endIndex],
                caseMatchingCouncillor,
              );
            },
          });
        }
      }
      return {
        Identifier(node) {
          findTyposForNode(node, node.name);
        },
        JSXText(node) {
          findTyposForNode(node, node.raw);
        },
        TemplateElement(node) {
          findTyposForNode(node, node.value.raw, 1);
        },
        Literal(node) {
          if (typeof node.value !== 'string') return;
          findTyposForNode(node, node.raw);
        },
      };
    },
  },
};

module.exports = {
  rules,
};
