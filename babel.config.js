module.exports = {
  "plugins": ["@babel/syntax-dynamic-import"],
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
}
