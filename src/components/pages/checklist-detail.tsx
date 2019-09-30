import * as React from 'react'
import { connect } from 'react-redux'
import { Loader } from '@reapit/elements'
import { oc } from 'ts-optchain'
import { ReduxState } from '@/types/core'
import ErrorBoundary from '@/components/hocs/error-boundary'
import { withRouter, RouteComponentProps } from 'react-router'
import Section, { SectionProps } from '@/components/ui/section'
import AMLProgressBar from '@/components/ui/aml-progressbar'
import Modal from '@/components/ui/modal'
import styles from '@/styles/pages/checklist-detail.scss?mod'
import { Dispatch } from 'redux'
import { checkListDetailHideModal, checkListDetailShowModal } from '@/actions/checklist-detail'
import { ContactModel } from '@/types/contact-api-schema'
import { STEPS } from '../ui/modal/modal'

export type CheckListDetailProps = HomeMappedActions & HomeMappedProps & RouteComponentProps<{ id?: any }>

export const generateSection = (onClick: (modalType: string) => () => void) => {
  return [
    {
      title: 'Personal Details',
      isCompleted: false,
      onEdit: onClick(STEPS.PROFILE),
      buttonText: 'Edit'
    },
    {
      title: 'Primary ID',
      isCompleted: false,
      onEdit: onClick(STEPS.PRIMARY_IDENTIFICATION),
      buttonText: 'Edit'
    },
    {
      title: 'Secondary ID',
      isCompleted: false,
      onEdit: onClick(STEPS.SECONDARY_IDENTIFICATION),
      buttonText: 'Edit'
    },
    {
      title: 'Address History',
      isCompleted: true,
      onEdit: onClick(STEPS.ADDRESS_INFORMATION),
      buttonText: 'Edit'
    },
    {
      title: 'Declaration and Risk Assessment',
      isCompleted: false,
      onEdit: onClick(STEPS.DECLARATION_RISK_MANAGEMENT),
      buttonText: 'Edit'
    },
    {
      title: 'PEP Search',
      isCompleted: true,
      onEdit: onClick('PEP_SEARCH'),
      buttonText: 'Edit'
    },
    {
      title: 'Experian ',
      isCompleted: true,
      onEdit: onClick('EXPERIAN'),
      buttonText: 'Edit'
    },
    {
      title: 'Report ',
      isCompleted: true,
      onEdit: onClick(STEPS.REPORT),
      buttonText: 'Edit'
    }
  ]
}

export const renderSections = (sections: SectionProps[]) => {
  return sections.map((section, index) => {
    return (
      <div key={index} className="mb-5">
        <Section
          title={section.title}
          isCompleted={section.isCompleted}
          onEdit={section.onEdit}
          buttonText={section.buttonText}
        />
      </div>
    )
  })
}

export const ChecklistDetail: React.FC<CheckListDetailProps> = ({
  isModalVisible,
  loading,
  hideModal,
  showModal,
  contact,
  modalContentType,
  match: {
    params: { id }
  }
}) => {
  if (loading) {
    return <Loader />
  }

  let title = ''
  let forename = ''
  let surname = ''

  if (Object.keys(contact).length > 0) {
    ;({ title = '', forename = '', surname = '' } = contact as ContactModel)
  }

  // TODO: Will replace callback by dispatch to show modald`
  const sections = generateSection(showModal)
  return (
    <ErrorBoundary>
      <div className={styles.topNavbar}>
        <div>
          <a>Back to Client/Logout</a>
        </div>
        <div>
          <a>Customise Form</a>
        </div>
      </div>
      <div className="mb-5">
        <AMLProgressBar title={`${title} ${forename} ${surname}`} />
      </div>
      {renderSections(sections)}
      <Modal
        id={id}
        contact={contact}
        visible={isModalVisible}
        afterClose={hideModal}
        modalContentType={modalContentType}
      />
    </ErrorBoundary>
  )
}

export type HomeMappedProps = {
  isModalVisible: boolean
  loading: boolean
  contact: ContactModel | {}
  modalContentType: string
}

export const mapStateToProps = (state: ReduxState): HomeMappedProps => ({
  isModalVisible: oc(state).checklistDetail.isModalVisible(false),
  loading: oc(state).checklistDetail.loading(true),
  contact: oc(state).checklistDetail.checklistDetailData.contact({}),
  modalContentType: oc(state).checklistDetail.modalContentType('PROFILE')
})

export type HomeMappedActions = {
  hideModal: () => void
  showModal: (modalType: string) => () => void
}

export const mapDispatchToProps = (dispatch: Dispatch): HomeMappedActions => ({
  hideModal: () => dispatch(checkListDetailHideModal()),
  showModal: (modalType: string) => () => dispatch(checkListDetailShowModal(modalType))
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ChecklistDetail)
)
