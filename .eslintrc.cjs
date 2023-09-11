module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-recommended',
    'standard-with-typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['tsconfig.json', 'tsconfig.eslint.json'],
    extraFileExtensions: ['.vue'],
    parser: '@typescript-eslint/parser',
    tsconfigRootDir: __dirname,
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/triple-slash-reference': 'off', // 关闭三斜杠引用
    '@typescript-eslint/ban-types': 'off', // 关闭禁止使用object，{}的类型检查
    'vue/no-unused-vars': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'off', // 关闭不安全的成员访问
    '@typescript-eslint/no-unsafe-call': 'off', // 关闭不安全的方法调用
    '@typescript-eslint/no-invalid-void-type': 'off', // 关闭参数void类型检查
    '@typescript-eslint/no-empty-interface': 'off', // 关闭空接口报错
    '@typescript-eslint/explicit-function-return-type': 'off', // 关闭函数返回值类型检查
    '@typescript-eslint/no-explicit-any': 'off', // 关闭any类型检查
    // '@typescript-eslint/no-unsafe-assignment': 'off', // 关闭不安全的赋值
    '@typescript-eslint/no-extraneous-class': 'off', // 关闭不必要的类检查
    '@typescript-eslint/restrict-template-expressions': 'off', // 关闭模板字符串检查
    'vue/multi-word-component-names': 'off', // 关闭组件名检查
    '@typescript-eslint/no-non-null-assertion': 'off', // 关闭非空断言
  },
};
