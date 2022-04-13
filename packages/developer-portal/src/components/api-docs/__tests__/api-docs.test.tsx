import React from 'react'
import ApiDocs, { parseIframeUrl } from '../api-docs'
import Routes from '@/constants/routes'
import { render } from '../../../tests/react-testing'

jest.mock('react-router', () => ({
  ...(jest.requireActual('react-router') as Object),
  useLocation: jest.fn(() => ({ search: '', pathname: '/test' })),
}))

describe('ApiDocs', () => {
  it('should match a snapshot', () => {
    const wrapper = render(<ApiDocs />)
    expect(wrapper).toMatchSnapshot()
  })

  describe('parseIframeUrl', () => {
    it('should run correctly', () => {
      const pathname = `${Routes.API_DOCS}/platform-glossary`
      const hash = '#company'
      const result = parseIframeUrl(pathname, hash)
      expect(result).toEqual('/platform-glossary#company')
    })
  })
})
