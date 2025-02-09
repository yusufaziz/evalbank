import antfu from "@antfu/eslint-config"
import nuxt from "./.nuxt/eslint.config.mjs"

export default nuxt(
  antfu({
    formatters: true,
    stylistic: {
      "quotes": "double",
      "max-attributes-per-line": ["error", {
        singleline: 1,
        multiline: 1,
      }],
      "overrides": {
        "vue/singleline-html-element-content-newline": ["error", {
          ignoreWhenNoAttributes: false,
          ignoreWhenEmpty: true,
          ignores: ["pre", "textarea"],
        }],
        "vue/multiline-html-element-content-newline": ["error", {
          ignoreWhenEmpty: true,
          ignores: ["pre", "textarea"],
          allowEmptyLines: false,
        }],
        "vue/html-closing-bracket-newline": ["error", {
          singleline: "never",
          multiline: "always",
        }],
        "vue/html-indent": ["error", 2, {
          attribute: 1,
          baseIndent: 1,
          closeBracket: 0,
          alignAttributesVertically: true,
          ignores: [],
        }],
        "vue/max-attributes-per-line": ["error", {
          singleline: 1,
          multiline: 1,
        }],
      },
    },
  }),
)
