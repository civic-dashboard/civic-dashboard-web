"use strict";

const CLASS_NAME = "classic-link";
const MESSAGE_ID = "missingClassicLink";

function getJSXElementName(node) {
  if (node && node.name) {
    if (node.name.type === "JSXIdentifier") return node.name.name;
    if (node.name.type === "JSXMemberExpression") {
      let cur = node.name;
      while (cur && cur.type === "JSXMemberExpression") {
        cur = cur.property;
      }
      return cur && cur.name;
    }
  }
  return null;
}

function attributeName(attr) {
  return attr && attr.name && attr.name.name;
}

function stringContainsClassicLink(value) {
  if (typeof value !== "string") return false;
  return /\bclassic-link\b/.test(value);
}

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: `Require anchors with ` + "`href`" + ` to include class "${CLASS_NAME}"`,
      recommended: false
    },
    schema: [],
    messages: {
      [MESSAGE_ID]: `Anchor with ` + "`href`" + ` should include the class "${CLASS_NAME}".`
    }
  },

  create(context) {
    return {
      JSXOpeningElement(node) {
        const name = getJSXElementName(node);
        if (name !== "a") return;

        const attrs = node.attributes || [];

        const hasHref = attrs.some(
          (a) => a.type === "JSXAttribute" && attributeName(a) === "href"
        );
        if (!hasHref) return;

        const classAttr = attrs.find(
          (a) =>
            a.type === "JSXAttribute" &&
            (attributeName(a) === "className" || attributeName(a) === "class")
        );

        if (!classAttr) {
          context.report({ node, messageId: MESSAGE_ID });
          return;
        }

        if (!classAttr.value) {
          context.report({ node: classAttr, messageId: MESSAGE_ID });
          return;
        }

        if (classAttr.value.type === "Literal") {
          if (!stringContainsClassicLink(classAttr.value.value)) {
            context.report({ node: classAttr, messageId: MESSAGE_ID });
          }
          return;
        }

        if (classAttr.value.type === "JSXExpressionContainer") {
          const expr = classAttr.value.expression;

          if (expr && expr.type === "Literal") {
            if (!stringContainsClassicLink(expr.value)) {
              context.report({ node: classAttr, messageId: MESSAGE_ID });
            }
            return;
          }

          if (expr && expr.type === "TemplateLiteral") {
            const cooked = expr.quasis.map((q) => q.value && q.value.cooked).join("");
            if (!stringContainsClassicLink(cooked)) {
              context.report({ node: classAttr, messageId: MESSAGE_ID });
            }
            return;
          }

          return;
        }

        context.report({ node: classAttr, messageId: MESSAGE_ID });
      }
    };
  }
};
