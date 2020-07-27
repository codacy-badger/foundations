const Routes = {
  AUTHENTICATION: '/authentication',
  APPS: '/apps',
  APP_DETAIL: '/apps/:appid',
  APP_DETAIL_MANAGE: '/apps/:appid/manage',
  INSTALLED_APPS: '/installed',
  INSTALLED_APPS_PAGINATE: '/installed/:page',
  MY_APPS: '/manage',
  MY_APPS_PAGINATE: '/manage/:page',
  SETTINGS: '/settings',
  HELP: '/help',
  LOGIN: '/login',
  FOUR_O_FOUR: '/404',
  DEVELOPER_ROUTES: '/developer/*',
}

export const developerRoutes = {
  DEV: 'https://dev.developers.reapit.cloud',
  PROD: 'https://developers.reapit.cloud',
  DESKTOP: '/desktop',
}

export default Routes
