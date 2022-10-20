import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import {
  AppSummaryModelPagedResult,
  InstallationModel,
  InstallationModelPagedResult,
} from '@reapit/foundations-ts-definitions'
import {
  PageContainer,
  Loader,
  Title,
  FormLayout,
  elMb11,
  InputWrap,
  InputGroup,
  Table,
  Pagination,
  InputWrapFull,
  Label,
  SearchableDropdown,
} from '@reapit/elements'
import { useForm } from 'react-hook-form'
import dayjs from 'dayjs'
import { SearchableMultiSelect, useReapitGet } from '@reapit/utils-react'
import { combineAddress, GetActionNames, getActions, isTruthy } from '@reapit/utils-common'
import { reapitConnectBrowserSession } from '../../core/connect-session'
import { Statistics } from '../statistics'
import { fetchDevelopersList } from '../../services/developers'
import { fetchCustomersList } from '../../services/customers'

export interface InstallationFilters {
  installedDateFrom?: string
  installedDateTo?: string
  appIds: string
  isInstalled: 'ALL' | 'INSTALLED' | 'UNINSTALLED'
  companyName?: string
  clientId?: string
}

const defaultValues: InstallationFilters = {
  appIds: '',
  isInstalled: 'ALL',
}

export interface InstallationsWithAppName extends InstallationModelPagedResult {
  data: (InstallationModel & { appName: string })[]
}

export const formatFilters = (installationsFilters: InstallationFilters) => {
  const { installedDateTo, installedDateFrom, isInstalled, appIds, clientId, companyName } = installationsFilters

  const isInstaledQuery =
    isInstalled === 'INSTALLED' ? { isInstalled: true } : isInstalled === 'UNINSTALLED' ? { isInstalled: true } : {}

  const appIdQuery = appIds ? { appId: appIds.split(',').filter(Boolean) } : {}
  const clientIdQuery = clientId ? { clientId } : {}
  const companyNameQuery = companyName ? { companyName } : {}

  return {
    installedDateTo: installedDateTo ? dayjs(installedDateTo).format('YYYY-MM-DDTHH:mm:ss') : undefined,
    installedDateFrom: installedDateFrom ? dayjs(installedDateFrom).format('YYYY-MM-DDTHH:mm:ss') : undefined,
    ...isInstaledQuery,
    ...appIdQuery,
    ...clientIdQuery,
    ...companyNameQuery,
  }
}

export const handleSetAppNames =
  (
    setInstallationsWithAppName: Dispatch<SetStateAction<InstallationsWithAppName | null>>,
    installations: InstallationModelPagedResult | null,
    apps: AppSummaryModelPagedResult | null,
    numberApps: number,
  ) =>
  () => {
    const isCsvOutput = installations?.pageSize === 9999

    if (isCsvOutput && apps?.data?.length !== numberApps) return

    if (apps && installations) {
      const installationsWithAppName = {
        ...installations,
        data: installations.data?.map((installation) => {
          const appName = apps.data?.find((app) => app.id === installation.appId)?.name ?? ''

          return {
            ...installation,
            appName,
          }
        }),
      } as InstallationsWithAppName

      setInstallationsWithAppName(installationsWithAppName)
    }
  }

export const Installations: FC = () => {
  const [installationsFilters, setInstallationsFilters] = useState<InstallationFilters>(defaultValues)
  const [installationsWithAppName, setInstallationsWithAppName] = useState<InstallationsWithAppName | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(12)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<InstallationFilters>({
    mode: 'onChange',
    defaultValues,
  })

  const [installations, installationsLoading] = useReapitGet<InstallationModelPagedResult>({
    reapitConnectBrowserSession,
    action: getActions(window.reapit.config.appEnv)[GetActionNames.getInstallations],
    queryParams: {
      ...formatFilters(installationsFilters),
      pageNumber,
      pageSize,
    },
  })

  const appIds = new Set(installations?.data?.map((installation) => installation.appId).filter(isTruthy) ?? [])
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

  useEffect(handleSetAppNames(setInstallationsWithAppName, installations, apps, numberApps), [
    apps,
    numberApps,
    installations,
  ])

  return (
    <PageContainer>
      <Title>Installations</Title>
      <form onChange={handleSubmit(setInstallationsFilters)}>
        <FormLayout className={elMb11}>
          <InputWrapFull>
            <SearchableMultiSelect
              id="app-ids-select"
              label="Search Apps"
              errorString={errors.appIds?.message ?? ''}
              defaultList={[]}
              currentValues={getValues().appIds?.split(',')?.filter(Boolean)}
              reapitConnectBrowserSession={reapitConnectBrowserSession}
              valueKey="id"
              nameKey="name"
              searchKey="appName"
              dataListKey="data"
              action={getActions(window.reapit.config.appEnv)[GetActionNames.getApps]}
              queryParams={{ pageSize: 100 }}
              noneSelectedLabel="No apps selected"
              {...register('appIds')}
            />
          </InputWrapFull>
          <InputWrap>
            <Label>Company</Label>
            <SearchableDropdown
              id="developer-search-box"
              {...register('companyName')}
              getResults={(company: string) =>
                fetchDevelopersList({ company, status: 'confirmed' }).then((developers) => developers?.data ?? [])
              }
              getResultLabel={(result) => `${result.company} -  ${result.name}`}
              getResultValue={(result) => result.company ?? ''}
              placeholder="Search developer organisations"
            />
          </InputWrap>
          <InputWrap>
            <Label>Client</Label>
            <SearchableDropdown
              id="client-search-box"
              {...register('clientId')}
              getResults={(name: string) => fetchCustomersList({ name }).then((customers) => customers?.data ?? [])}
              getResultLabel={(result) => result.name ?? ''}
              getResultValue={(result) => result.agencyCloudId ?? ''}
              placeholder="Search customers"
            />
          </InputWrap>
          <InputWrap>
            <InputGroup {...register('installedDateFrom')} label="Installed Date From" type="date" />
          </InputWrap>
          <InputWrap>
            <InputGroup {...register('installedDateTo')} label="Installed Date To" type="date" />
          </InputWrap>
        </FormLayout>
      </form>
      <Statistics area="INSTALLATIONS" data={installationsWithAppName} setPageSize={setPageSize} />
      {installationsLoading ? (
        <Loader />
      ) : (
        <>
          <Table
            className={elMb11}
            rows={installationsWithAppName?.data?.map(
              ({
                customerName,
                client,
                customerAddress,
                created,
                installedBy,
                uninstalledBy,
                terminatesOn,
                appName,
              }) => ({
                cells: [
                  {
                    label: 'Customer Name',
                    value: customerName,
                    icon: 'flatInfographic',
                    cellHasDarkText: true,
                    narrowTable: {
                      showLabel: true,
                    },
                  },
                  {
                    label: 'App Name',
                    value: appName,
                    icon: 'appInfographic',
                    cellHasDarkText: true,
                    narrowTable: {
                      showLabel: true,
                    },
                  },
                  {
                    label: 'Reapit Customer Code',
                    value: client,
                    narrowTable: {
                      showLabel: true,
                    },
                  },
                  {
                    label: 'Customer Address',
                    value: combineAddress(customerAddress),
                    narrowTable: {
                      showLabel: true,
                    },
                  },
                  {
                    label: 'Date Installed',
                    value: dayjs(created).format('DD-MM-YYYY'),
                    narrowTable: {
                      showLabel: true,
                    },
                  },
                  {
                    label: 'Installed By',
                    value: installedBy,
                    narrowTable: {
                      showLabel: true,
                    },
                  },
                  {
                    label: 'Date Uninstalled',
                    value: terminatesOn ? dayjs(terminatesOn).format('DD-MM-YYYY') : '-',
                    narrowTable: {
                      showLabel: true,
                    },
                  },
                  {
                    label: 'Uninstalled By',
                    value: uninstalledBy ?? '-',
                    narrowTable: {
                      showLabel: true,
                    },
                  },
                ],
              }),
            )}
          />
          <Pagination
            callback={setPageNumber}
            currentPage={pageNumber}
            numberPages={Math.ceil((installations?.totalCount ?? 1) / 12)}
          />
        </>
      )}
    </PageContainer>
  )
}

export default Installations
