const scss = require('rollup-plugin-scss')
const babel = require('@rollup/plugin-babel').default
const linaria = require('@linaria/rollup').default
const svgr = require('@svgr/rollup').default

const EXCLUDE_PACKAGES = ['@linaria/core', '@linaria/react']

const generateRegexExcludePackages = () => {
  const listPackagesString = EXCLUDE_PACKAGES.join('|')
  return new RegExp(`node_modules/(?!(${listPackagesString})/).*`)
}

// Overrides and changes the order of TSDX's rollup config to accomodate linaria
const replaceAndReorderPlugins = (plugins) => {
  // Babel just to take my ESNEXT code and make legacy browser friendly
  const babelPlugin = babel({
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            ie: '11',
          },
          useBuiltIns: 'usage',
          corejs: 3,
        },
      ],
    ],
    exclude: generateRegexExcludePackages(),
    extensions: ['.ts', '.tsx'],
    babelHelpers: 'runtime',
    plugins: ['@babel/plugin-transform-runtime'],
  })

  // export linaria css and main sass project
  const sassPlugin = scss({
    output: 'dist/index.css',
  })

  // Linaria config
  const linariaPlugin = linaria({
    sourceMap: process.env.NODE_ENV !== 'production',
  })

  const tsPlugin = plugins.find((plugin) => plugin.name === 'rpt2')

  const svgrPlugin = svgr({ icon: true })

  // Add linaria and sass plugins in between TS and Babel
  plugins.splice(plugins.indexOf(tsPlugin), 2, tsPlugin, linariaPlugin, sassPlugin, babelPlugin, svgrPlugin)

  return plugins
}

module.exports = {
  rollup(config) {
    const plugins = replaceAndReorderPlugins(config.plugins)

    return {
      ...config,
      output: {
        ...config.output,
        globals: {
          ...config.output.globals,
          'react-dom': 'react-dom',
          formik: 'formik',
          'react-router-dom': 'react-router-dom',
          'react-google-map': 'react-google-map',
          'react-google-maps-loader': 'react-google-maps-loader',
          'react-datepicker': 'react-datepicker',
          dayjs: 'dayjs',
          'dayjs/plugin/customParseFormat': 'dayjs/plugin/customParseFormat',
          'react-table': 'react-table',
          'react-icons/md': 'react-icons/md',
          pell: 'pell',
          himalaya: 'himalaya',
          'react-datasheet': 'react-datasheet',
          papaparse: 'papaparse',
          'dayjs/plugin/utc': 'dayjs/plugin/utc',
          'react-is': 'react-is',
          linaria: 'linaria',
          classnames: 'classnames',
          'react-icons/fa': 'react-icons/fa',
          'rc-notification': 'rc-notification',
          'rc-notification/lib/useNotification': 'rc-notification/lib/useNotification',
          'rc-select': 'rc-select',
          'rc-tooltip': 'rc-tooltip',
          '@babel/runtime/helpers/taggedTemplateLiteral': '_taggedTemplateLiteral',
          '@babel/runtime/helpers/defineProperty': '_defineProperty',
          '@babel/runtime/helpers/slicedToArray': '_slicedToArray',
          '@babel/runtime/helpers/toConsumableArray': '_toConsumableArray',
          tslib: 'tslib',
          '@babel/runtime/helpers/typeof': '_typeof',
          '@babel/runtime/regenerator': '_regeneratorRuntime',
          '@babel/runtime/helpers/classCallCheck': '_classCallCheck',
          '@babel/runtime/helpers/inherits': '_inherits',
          '@babel/runtime/helpers/possibleConstructorReturn': '_possibleConstructorReturn',
          '@babel/runtime/helpers/getPrototypeOf': '_getPrototypeOf',
          '@babel/runtime/helpers/assertThisInitialized': '_assertThisInitialized',
          '@babel/runtime/helpers/wrapNativeSuper': '_wrapNativeSuper',
          '@babel/runtime/helpers/objectWithoutProperties': '_objectWithoutProperties',
          '@babel/runtime/helpers/asyncToGenerator': '_asyncToGenerator',
        },
      },
      plugins: [...plugins],
    }
  },
}
