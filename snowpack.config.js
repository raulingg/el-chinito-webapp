module.exports = {
  extends: '@snowpack/app-scripts-react',
  scripts: {
    'build:css': 'postcss',
  },
  plugins: ['@snowpack/plugin-react-refresh'],
  installOptions: {
    rollup: {
      plugins: [require('rollup-plugin-node-polyfills')()],
    },
  },
}
