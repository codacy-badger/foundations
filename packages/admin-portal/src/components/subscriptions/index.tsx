import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import ErrorBoundary from '../error-boundary'
import {
  GetActionNames,
  getActions,
  isTruthy,
  toLocalTime,
  UpdateActionNames,
  updateActions,
} from '@reapit/utils-common'
import {
  PageContainer,
  Loader,
  Title,
  Pagination,
  Table,
  elMb11,
  useModal,
  BodyText,
  ButtonGroup,
  Button,
} from '@reapit/elements'
import { objectToQuery, SendFunction, useReapitGet, useReapitUpdate } from '@reapit/utils-react'
import {
  AppSummaryModelPagedResult,
  SubscriptionModel,
  SubscriptionModelPagedResult,
} from '@reapit/foundations-ts-definitions'
import { reapitConnectBrowserSession } from '../../core/connect-session'
import { FilterForm } from './filter-form'
import { Statistics } from '../statistics'
import { usePermissionsState } from '../../core/use-permissions-state'

export interface SubscriptionsFilters {
  subscriptionType?: string
  organisationName?: string
  userEmail?: string
  status?: string
}

export interface SubsWithAppName extends SubscriptionModelPagedResult {
  data: (SubscriptionModel & { appName: string })[]
}

export const handleSetAppNames =
  (
    setInstallationsWithAppName: Dispatch<SetStateAction<SubsWithAppName | null>>,
    subscriptions: SubscriptionModelPagedResult | null,
    apps: AppSummaryModelPagedResult | null,
    numberApps: number,
  ) =>
  () => {
    const isCsvOutput = subscriptions?.pageSize === 9999

    if (isCsvOutput && apps?.data?.length !== numberApps) return

    if (apps && subscriptions) {
      const subscriptionsWithAppName = {
        ...subscriptions,
        data: subscriptions.data?.map((sub) => {
          const appName = apps.data?.find((app) => app.id === sub.applicationId)?.name ?? ''

          return {
            ...sub,
            appName,
          }
        }),
      } as SubsWithAppName

      setInstallationsWithAppName(subscriptionsWithAppName)
    }
  }

export const handleCancelSub =
  (cancelSub: SendFunction<void, boolean | null>, setCancelSubId: Dispatch<SetStateAction<string | null>>) => () => {
    cancelSub()
    setCancelSubId(null)
  }

export const handleCancelSubSuccess = (refetchSubs: () => void, closeModal: () => void, success?: boolean) => () => {
  if (success) {
    refetchSubs()
    closeModal()
  }
}

export const handleSetSubId =
  (setCancelSubId: Dispatch<SetStateAction<string | null>>, openModal: () => void, cancelSubId?: string) => () => {
    if (cancelSubId) {
      openModal()
      setCancelSubId(cancelSubId)
    }
  }

const Subscriptions: FC = () => {
  const [subscriptionsFilters, setSubscriptionsFilters] = useState<SubscriptionsFilters>({})
  const [subsWithAppName, setSubsWithAppName] = useState<SubsWithAppName | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(12)
  const [cancelSubId, setCancelSubId] = useState<string | null>(null)
  const { Modal, openModal, closeModal } = useModal()
  const { hasReadAccess } = usePermissionsState()

  const [subscriptions, subscriptionsLoading, , refetchSubs] = useReapitGet<SubscriptionModelPagedResult>({
    reapitConnectBrowserSession,
    action: getActions(window.reapit.config.appEnv)[GetActionNames.getSubscriptions],
    queryParams: {
      ...objectToQuery(subscriptionsFilters),
      userEmail: subscriptionsFilters.userEmail ? encodeURIComponent(subscriptionsFilters.userEmail ?? '') : undefined,
      pageSize,
      pageNumber,
    },
  })

  const [, , cancelSub, cancelSubSuccess] = useReapitUpdate<void, null>({
    reapitConnectBrowserSession,
    action: updateActions(window.reapit.config.appEnv)[UpdateActionNames.deleteSubscription],
    method: 'DELETE',
    uriParams: {
      subscriptionId: cancelSubId,
    },
  })

  const appIds = new Set(subscriptions?.data?.map((sub) => sub.applicationId).filter(isTruthy) ?? [])
  const appIdArray = [...appIds]
  const numberApps = appIdArray.length

  const [apps] = useReapitGet<AppSummaryModelPagedResult>({
    reapitConnectBrowserSession,
    action: getActions(window.reapit.config.appEnv)[GetActionNames.getApps],
    queryParams: {
      id: appIdArray,
      pageSize: 999,
    },
    fetchWhenTrue: [numberApps],
  })

  useEffect(handleSetAppNames(setSubsWithAppName, subscriptions, apps, numberApps), [apps, subscriptions, numberApps])
  useEffect(handleCancelSubSuccess(refetchSubs, closeModal, cancelSubSuccess), [cancelSubSuccess])

  return (
    <ErrorBoundary>
      <PageContainer>
        <Title>Subscriptions</Title>
        <FilterForm setSubscriptionsFilters={setSubscriptionsFilters} />
        <Statistics area="SUBSCRIPTIONS" data={subsWithAppName} setPageSize={setPageSize} />
        {subscriptionsLoading ? (
          <Loader />
        ) : (
          <>
            <Table
              className={elMb11}
              numberColumns={11}
              rows={subsWithAppName?.data?.map(
                ({
                  id,
                  type,
                  summary,
                  organisationName,
                  user,
                  appName,
                  created,
                  renews,
                  frequency,
                  cost,
                  cancelled,
                }) => ({
                  cells: [
                    {
                      label: 'Subcription Type',
                      value: type,
                      cellHasDarkText: true,
                      narrowTable: {
                        showLabel: true,
                      },
                    },
                    {
                      label: 'Summary',
                      value: summary,
                      narrowTable: {
                        showLabel: true,
                      },
                    },
                    {
                      label: 'App Name',
                      value: appName,
                      narrowTable: {
                        showLabel: true,
                      },
                    },
                    {
                      label: 'Company Name',
                      value: organisationName,
                      narrowTable: {
                        showLabel: true,
                      },
                    },
                    {
                      label: 'User Email',
                      value: user,
                      narrowTable: {
                        showLabel: true,
                      },
                    },
                    {
                      label: 'Start Date',
                      value: toLocalTime(created),
                      narrowTable: {
                        showLabel: true,
                      },
                    },
                    {
                      label: 'Renews',
                      value: renews ? toLocalTime(renews) : '-',
                      narrowTable: {
                        showLabel: true,
                      },
                    },
                    {
                      label: 'Frequency',
                      value: frequency,
                      narrowTable: {
                        showLabel: true,
                      },
                    },
                    {
                      label: 'Cost',
                      value: `£${cost}`,
                      narrowTable: {
                        showLabel: true,
                      },
                    },
                    {
                      label: 'Cancelled',
                      value: cancelled ? toLocalTime(cancelled) : '-',
                      narrowTable: {
                        showLabel: true,
                      },
                    },
                  ],
                  ctaContent: {
                    headerContent: 'Cancel',
                    icon: cancelled || hasReadAccess ? undefined : 'trashSystem',
                    onClick: cancelled || hasReadAccess ? undefined : handleSetSubId(setCancelSubId, openModal, id),
                  },
                }),
              )}
            />
            <Pagination
              callback={setPageNumber}
              currentPage={pageNumber}
              numberPages={Math.ceil((subscriptions?.totalCount ?? 1) / 12)}
            />
            <Modal title="Cancel Subscription">
              <BodyText>Please confirm you wish to cancel this subscription</BodyText>
              <ButtonGroup alignment="right">
                <Button intent="low" type="button" onClick={closeModal}>
                  Close
                </Button>
                <Button intent="danger" onClick={handleCancelSub(cancelSub, setCancelSubId)}>
                  Cancel
                </Button>
              </ButtonGroup>
            </Modal>
          </>
        )}
      </PageContainer>
    </ErrorBoundary>
  )
}

export default Subscriptions
