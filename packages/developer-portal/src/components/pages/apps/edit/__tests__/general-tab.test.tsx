import React, { MouseEvent } from 'react'
import { Control, UseFormGetValues } from 'react-hook-form'
import { render } from '../../../../../tests/react-testing'
import { AppEditTab } from '../edit-page-tabs'
import { AppEditFormSchema } from '../form-schema/form-fields'
import { GeneralTab, handleOpenModal } from '../general-tab'
import { defaultValues as mockAppEditForm } from '../../edit/form-schema/form-fields'

jest.mock('../../state/use-app-state')

describe('GeneralTab', () => {
  it('should match a snapshot', () => {
    expect(
      render(
        <GeneralTab
          register={jest.fn()}
          errors={{}}
          tab={AppEditTab.general}
          control={{} as Control<AppEditFormSchema, object>}
          getValues={jest.fn(() => mockAppEditForm) as unknown as UseFormGetValues<AppEditFormSchema>}
        />,
      ),
    ).toMatchSnapshot()
  })
})

describe('handleOpenModal', () => {
  it('should handle opening modal', () => {
    const openModal = jest.fn()
    const curried = handleOpenModal(openModal)
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    } as unknown as MouseEvent

    curried(event)

    expect(openModal).toHaveBeenCalledTimes(1)
  })
})
