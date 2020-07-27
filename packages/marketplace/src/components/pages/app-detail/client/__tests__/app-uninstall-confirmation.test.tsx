import * as React from 'react'
import * as ReactRedux from 'react-redux'
import { mount, shallow } from 'enzyme'
import configureStore from 'redux-mock-store'
import { MemoryRouter } from 'react-router'
import { appDetailDataStub } from '@/sagas/__stubs__/app-detail'
import { appInstallationsRequestUninstall } from '@/actions/app-installations'
import { clientFetchAppDetail } from '@/actions/client'
import ClientAppUninstallConfirmation, {
  AppUninstallConfirmationProps,
  onUninstallButtonClick,
  handleUninstallAppSuccessCallback,
  handleSuccessAlertButtonClick,
  handleSuccessAlertMessageAfterClose,
  renderUninstallConfirmationModalFooter,
} from '../app-uninstall-confirmation'
import Routes from '@/constants/routes'
import appState from '@/reducers/__stubs__/app-state'

const mockProps: AppUninstallConfirmationProps = {
  appDetailData: appDetailDataStub.data,
  visible: true,
  closeUninstallConfirmationModal: jest.fn(),
}

const clientId = '123'
describe('ClientAppUninstallConfirmation', () => {
  let store
  let spyDispatch
  const appId = mockProps.appDetailData?.id || ''
  const installationId = mockProps.appDetailData?.installationId || ''

  beforeEach(() => {
    /* mocking store */
    const mockStore = configureStore()
    store = mockStore(appState)
    /* mocking useDispatch on our mock store  */
    spyDispatch = jest.spyOn(ReactRedux, 'useDispatch').mockImplementation(() => store.dispatch)
  })

  it('should match a snapshot', () => {
    expect(
      mount(
        <ReactRedux.Provider store={store}>
          <MemoryRouter initialEntries={[{ pathname: Routes.APP_DETAIL, key: 'clientAppDetailRoute' }]}>
            <ClientAppUninstallConfirmation {...mockProps} />
          </MemoryRouter>
        </ReactRedux.Provider>,
      ),
    ).toMatchSnapshot()
  })

  describe('onUninstallButtonClick', () => {
    it('should run correctly', () => {
      const mockFunction = jest.fn()
      const fn = onUninstallButtonClick(
        appId,
        clientId,
        installationId,
        spyDispatch,
        mockFunction,
        mockProps.closeUninstallConfirmationModal,
        false,
      )
      fn()
      expect(spyDispatch).toBeCalledWith(
        appInstallationsRequestUninstall({
          appId,
          installationId,
          terminatedReason: 'User uninstall',
          callback: expect.any(Function),
        }),
      )
    })
  })

  describe('handleUninstallAppSuccessCallback', () => {
    it('should run correctly', () => {
      const mockFunction = jest.fn()
      const fn = handleUninstallAppSuccessCallback(mockFunction, mockProps.closeUninstallConfirmationModal, false)
      fn()
      expect(mockProps.closeUninstallConfirmationModal).toBeCalled()
      expect(mockFunction).toBeCalledWith(true)
    })
  })

  describe('handleSuccessAlertButtonClick', () => {
    const history = {
      replace: jest.fn(),
    } as any
    const fn = handleSuccessAlertButtonClick(history)
    fn()
    expect(history.replace).toBeCalledWith(Routes.APPS)
  })

  describe('handleSuccessAlertMessageAfterClose', () => {
    it('should match snapshot', () => {
      const mockFunction = jest.fn()
      const fn = handleSuccessAlertMessageAfterClose(appId, clientId, mockFunction, spyDispatch)
      fn()
      expect(spyDispatch).toBeCalledWith(
        clientFetchAppDetail({
          id: appId,
          clientId,
        }),
      )
      expect(mockFunction).toBeCalledWith(false)
    })
  })

  describe('renderUninstallConfirmationModalFooter', () => {
    it('should match snapshot', () => {
      const wrapper = shallow(
        <div>
          {renderUninstallConfirmationModalFooter(
            false,
            appId,
            clientId,
            installationId,
            spyDispatch,
            jest.fn(),
            jest.fn(),
            false,
          )}
        </div>,
      )
      expect(wrapper).toMatchSnapshot()
    })
  })
})
