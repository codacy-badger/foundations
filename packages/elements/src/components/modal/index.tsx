import React from 'react'
import { cx } from 'linaria'
import { Icon } from '../icon'
import { ElModalBg, ElModal, ElModalHeader, ElModalBody } from './__styles__'
import { elIsActive } from '../../styles/states'

export interface IModal extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onModalClose: () => void
  title?: string
  className?: string
}

export const Modal: React.FC<IModal> = ({ isOpen, onModalClose, title, className, children, ...rest }) => {
  if (!isOpen) return null

  const modalCombinedClassname = cx(className, elIsActive)

  return (
    <>
      <ElModalBg className={elIsActive} onClick={onModalClose} />
      <ElModal className={modalCombinedClassname} {...rest}>
        {title && (
          <ElModalHeader>
            {title}
            <Icon onClick={onModalClose} icon="closeSystem" />
          </ElModalHeader>
        )}
        <ElModalBody>{children}</ElModalBody>
      </ElModal>
    </>
  )
}
