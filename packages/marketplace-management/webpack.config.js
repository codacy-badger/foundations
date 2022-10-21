const { webpackConfigProd, webpackConfigDev } = require('@reapit/ts-scripts')

const isProd = process.env.NODE_ENV === 'production'
const appName = 'Marketplace Management'
const config = isProd ? webpackConfigProd({ appName }) : webpackConfigDev({ appName })

module.exports = config
