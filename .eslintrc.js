module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      // tsx: true, // Allows for the parsing of JSX
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint'],
  // settings: {
  //   tsx: {
  //     version: "detect" // Tells eslint-plugin-react to automatically detect the version of React to use
  //   }
  // },
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
  ],
  rules: {
    'max-len': [
      2,
      {
        code: 100,
        comments: 200,
      },
    ],
    'vue/max-attributes-per-line': [
      0,
      {
        singleline: 2,
        multiline: {
          max: 1,
          allowFirstLine: false,
        },
      },
    ],
    '@typescript-eslint/no-non-null-assertion': [0],
    'vue/multiline-html-element-content-newline': [0],
    'vue/singleline-html-element-content-newline': [0],
  },
};
