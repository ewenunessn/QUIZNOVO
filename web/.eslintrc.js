module.exports = {
  extends: ['react-app', 'react-app/jest'],
  rules: {
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'react-hooks/exhaustive-deps': 'warn'
  }
};