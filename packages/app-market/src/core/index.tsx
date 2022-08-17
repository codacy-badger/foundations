import React, { ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import { Config } from '../types/global'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import mixpanel from 'mixpanel-browser'
import { getMarketplaceGlobalsByKey, logger } from '@reapit/utils-react'

// Init global config
window.reapit = {
  config: {
    appEnv: 'local',
    sentryDns: '',
    mixPanelToken: '',
    connectClientId: '',
    connectOAuthUrl: '',
    connectUserPoolId: '',
    developerPortalUrl: '',
    orgAdminRestrictedAppIds: [],
    reapitConnectManagementUri: '',
    clientHiddenAppIds: {},
  },
}

export const renderApp = (Component: ComponentType) => {
  const rootElement = document.querySelector('#root') || document.body
  const isDesktop = getMarketplaceGlobalsByKey()
  const html = document.querySelector('html')

  if (isDesktop && html) {
    html.classList.add('is-desktop')
  }

  if (rootElement) {
    createRoot(rootElement).render(<Component />)
  }
}

const run = async () => {
  try {
    const configRes = await fetch('config.json')
    const config = (await configRes.json()) as Config
    const isLocal = config.appEnv !== 'production'

    if (!isLocal && config.sentryDns && !window.location.hostname.includes('prod.paas')) {
      Sentry.init({
        integrations: [new BrowserTracing()],
        release: process.env.APP_VERSION,
        dsn: config.sentryDns,
        environment: config.appEnv,
        tracesSampleRate: 1.0,
      })
    }

    // Switch to !isLocal when we go to prod
    if (isLocal && config.mixPanelToken) {
      mixpanel.init(config.mixPanelToken, { debug: isLocal })
    }

    // Set the global config
    window.reapit.config = config

    // I import the app dynamically so that the config is set on window and I avoid any
    // runtime issues where config is undefined
    const { default: App } = await import('./app')

    renderApp(App)
  } catch (error) {
    logger(error as Error)
  }
}

if (module['hot']) {
  module['hot'].accept()
}

run()
