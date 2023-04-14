module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['airbnb', 'airbnb/hooks'],
  globals: {
    chrome: true,
    window: true,
  },
  ignorePatterns: [
    'types/',
  ],
  rules: {
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'import/no-mutable-exports': 'off',
    'no-nested-ternary': 'warn',
    eqeqeq: 'off',
    semi: ['error', 'never'],
    'class-methods-use-this': 'off',
    'react/jsx-props-no-spreading': 'off',
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
    'no-console': 'off',
    'react/self-closing-comp': 'off',
    'object-curly-newline': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/no-import-module-exports': 'off',
    'global-require': 'off',
    'arrow-body-style': 'off',
    'react/no-unused-class-component-methods': 'off',
    'react/destructuring-assignment': 'off',
    'no-plusplus': 'off',
    radix: 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'import/prefer-default-export': 'off',
    'no-param-reassign': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'no-use-before-define': ['error', { functions: false }],
    'react/require-default-props': 'off',
    'max-len': ['warn', { code: 150 }],
    'default-param-last': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'lines-between-class-members': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-underscore-dangle': 'off',
    'consistent-return': 'off',
  },
}
