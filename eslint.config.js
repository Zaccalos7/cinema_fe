import pluginJs from '@eslint/js'
import pluginReact from 'eslint-plugin-react'
import reactCompiler from 'eslint-plugin-react-compiler'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}']
  },
  {languageOptions: {globals: {...globals.browser, ...globals.node}}},

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  {
    plugins: {
      'unused-imports': unusedImports,
      'react-compiler': reactCompiler
    }
  },
  {
    rules: {
      'comma-dangle': ['error', 'never'],
      'react-compiler/react-compiler': 'error',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'react/display-name': 'off',
      'no-restricted-syntax': ['error', 'FunctionExpression', 'FunctionDeclaration'],
      '@typescript-eslint/no-unsafe-function-type': 'off',
      'react/prop-types': 'off',
      'no-sparse-arrays': 'off',
      curly: ['error', 'all'],
      'eol-last': ['error', 'always'],
      eqeqeq: ['error', 'always'],
      'no-duplicate-imports': ['error', {includeExports: true}],

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          disallowTypeAnnotations: true,
          fixStyle: 'inline-type-imports',
          prefer: 'type-imports'
        }
      ],
      '@typescript-eslint/no-unused-vars': 'off', // or "@typescript-eslint/no-unused-vars": "off",
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_'
        }
      ]
    }
  }
]
