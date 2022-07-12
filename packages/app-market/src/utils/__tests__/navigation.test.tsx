import { navigate, openNewPage, handleLaunchApp } from '../navigation'
import { History } from 'history'
import { Routes } from '../../constants/routes'

describe('navigate', () => {
  it('should open a new page', () => {
    const mockHistory = {
      push: jest.fn(),
    } as unknown as History

    const curried = navigate(mockHistory, Routes.HOME)

    curried()

    expect(mockHistory.push).toHaveBeenCalledWith(Routes.HOME)
  })
})

describe('openNewPage', () => {
  it('should open a new page', () => {
    const windowSpy = ((window.open as any) = jest.fn())
    const curried = openNewPage(Routes.HOME)

    curried()

    expect(windowSpy).toHaveBeenCalledWith(Routes.HOME, '_blank')
  })
})

describe('handleLaunchApp', () => {
  it('should correctly launch if in web mode', () => {
    const id = 'MOCK_ID'
    const launchUri = 'https://foobar.com'
    const curried = handleLaunchApp(false, id, launchUri)

    curried()

    expect(window.location.href).toEqual(launchUri)
  })

  it('should correctly launch if in desktop mode', () => {
    const id = 'MOCK_ID'
    const launchUri = 'https://foobar.com'
    const curried = handleLaunchApp(true, id, launchUri)

    curried()

    expect(window.location.href).toEqual(`agencycloud://app?id=${id}&launchUri=${launchUri}`)
  })
})
