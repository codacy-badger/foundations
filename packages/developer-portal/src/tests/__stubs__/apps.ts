import { Marketplace } from '@reapit/foundations-ts-definitions'

export const mockAppSummaryModelPagedResult: Marketplace.AppSummaryModelPagedResult = {
  data: [
    {
      id: 'MOCK_APP_ID',
      name: 'MOCK_APP_NAME',
      launchUri: 'https://foo.bar',
      homePage: 'https://foo.bar',
      authFlow: 'clientCredentials',
      summary: 'Foo bar Foo bar Foo bar Foo bar Foo bar Foo bar Foo bar Foo bar',
      developerId: 'MOCK_DEVELOPER_ID',
      isFree: true,
      isListed: true,
      limitToClientIds: [],
      desktopIntegrationTypeIds: [],
      products: ['agencyCloud'],
    },
    {
      id: 'MOCK_OTHER_APP_ID',
      name: 'MOCK_APP_NAME_ANOTHER',
      launchUri: 'https://foo.bar',
      homePage: 'https://foo.bar',
      authFlow: 'authorisationCode',
      summary: 'Foo bar Foo bar Foo bar Foo bar Foo bar Foo bar Foo bar Foo bar',
      developerId: 'MOCK_DEVELOPER_ID',
      isFree: true,
      isListed: true,
      limitToClientIds: [],
      desktopIntegrationTypeIds: [],
      products: ['agencyCloud'],
    },
  ],
  pageNumber: 1,
  pageSize: 25,
  pageCount: 2,
  totalCount: 2,
}

export const mockAppDetailModel: Marketplace.AppDetailModel = {
  id: 'MOCK_APP_ID',
  created: '2022-02-24T14:30:07',
  developerId: 'MOCK_DEVELOPER_ID',
  installationId: 'MOCK_INSTALL_ID',
  externalId: 'MOCK_EXTERNAL_ID',
  rotatingExternalId: 'MOCK_ROTATING_EXTERNAL_ID',
  authFlow: 'authorisationCode',
  name: 'will-test-dev-co-voracious-person',
  summary: 'Foo bar Foo bar Foo bar Foo bar Foo bar Foo bar Foo bar Foo bar',
  description: 'Foo bar Foo bar Foo bar Foo bar Foo bar Foo bar Foo bar Foo bar',
  developer: 'Will Test DevCo',
  developerAbout: 'All about us in a number of words',
  supportEmail: 'foo@bar.com',
  telephone: '07777777777',
  homePage: 'https://foo.bar',
  launchUri: 'https://foo.bar',
  redirectUris: ['https://foo.bar'],
  signoutUris: ['https://foo.bar'],
  limitToClientIds: [],
  desktopIntegrationTypeIds: [],
  products: ['agencyCloud'],
  isListed: true,
  isDirectApi: true,
  isSandbox: true,
  isFeatured: true,
  isWebComponent: true,
  pendingRevisions: true,
  termsAndConditionsUrl: 'https://foo.bar',
  privacyPolicyUrl: 'https://foo.bar',
  pricingUrl: 'https://foo.bar',
  isFree: false,
  isHidden: false,
  launchWindowSizeX: 750,
  launchWindowSizeY: 950,
  scopes: [
    {
      name: 'agencyCloud/applicants.read',
      description: 'Read applicants',
    },
    {
      name: 'agencyCloud/properties.read',
      description: 'Read properties',
    },
  ],
  media: [
    {
      description: 'Application Icon',
      id: 'MOCK_ID',
      order: 0,
      type: 'icon',
      uri: 'https://foo.bar',
    },
    {
      description: 'Application Image',
      id: 'MOCK_ID',
      order: 0,
      type: 'image',
      uri: 'https://foo.bar',
    },
    {
      description: 'Application Video',
      id: 'MOCK_ID',
      order: 0,
      type: 'video',
      uri: 'https://www.youtube.com/embed/iKdil7liAts',
    },
  ],
}

export const mockCreateAppModel: Marketplace.CreateAppModel = {
  description: 'Foo bar Foo bar Foo bar Foo bar Foo bar Foo bar Foo bar Foo bar',
  homePage: 'https://foo.bar',
  iconImageUrl: 'https://some-s3-image-link.com',
  name: 'will-test-dev-co-voracious-person',
  launchUri: 'https://foo.bar',
  screen1ImageUrl: 'https://some-s3-image-link.com',
  screen2ImageUrl: 'https://some-s3-image-link.com',
  screen3ImageUrl: 'https://some-s3-image-link.com',
  screen4ImageUrl: 'https://some-s3-image-link.com',
  screen5ImageUrl: 'https://some-s3-image-link.com',
  summary: 'Foo bar Foo bar Foo bar Foo bar Foo bar Foo bar Foo bar Foo bar',
  supportEmail: 'foo@bar.com',
  telephone: '07777777777',
}
