import { useReapitGet } from '@reapit/utils-react'
import React from 'react'
import { render } from '../../../../tests/react-testing'
import { mockAppRevisionConsentModelResponse } from '../../../../tests/__stubs__/consents'
import { AppConsentsPage, handleResendEmail, handleSetConsentId } from '../index'

jest.mock('../../state/use-app-state')
jest.mock('../../../../core/use-global-state')
jest.mock('@reapit/utils-react', () => ({
  useReapitGet: jest.fn(() => [mockAppRevisionConsentModelResponse]),
  useReapitUpdate: jest.fn(() => [undefined, undefined, jest.fn()]),
}))

const mockUseReapitGet = useReapitGet as jest.Mock

describe('AppConsentsPage', () => {
  it('should match snapshot with consents', () => {
    expect(render(<AppConsentsPage />)).toMatchSnapshot()
  })

  it('should match snapshot where there are no consents returned', () => {
    mockUseReapitGet.mockReturnValueOnce([[]])
    expect(render(<AppConsentsPage />)).toMatchSnapshot()
  })

  it('should match snapshot where the app is loading', () => {
    mockUseReapitGet.mockReturnValueOnce([null, true])
    expect(render(<AppConsentsPage />)).toMatchSnapshot()
  })
})

describe('handleResendEmail', () => {
  it('should resend an email', async () => {
    const resendEmail = jest.fn(() => new Promise<boolean>((resolve) => resolve(true)))
    const setConsentId = jest.fn()
    const appConsentsRefresh = jest.fn()
    const consentId = 'MOCK_CONSENT_ID'
    const developerEmail = 'mail@example.com'

    const curried = handleResendEmail(resendEmail, setConsentId, appConsentsRefresh, consentId, developerEmail)

    curried()

    await new Promise((resolve) => resolve(true))

    expect(resendEmail).toHaveBeenCalledWith({ actionedBy: developerEmail })
    expect(appConsentsRefresh).toHaveBeenCalledTimes(1)
    expect(setConsentId).toHaveBeenCalledWith(null)
  })
})

describe('handleSetConsentId', () => {
  it('should set the consent id', () => {
    const setConsentId = jest.fn()
    const consentId = 'MOCK_CONSENT_ID'

    const curried = handleSetConsentId(setConsentId, consentId)

    curried()

    expect(setConsentId).toHaveBeenCalledWith(consentId)
  })
})
