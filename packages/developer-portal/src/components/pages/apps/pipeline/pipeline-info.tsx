import { reapitConnectBrowserSession } from '@/core/connect-session'
import { buildStatusToIntent, buildStatusToReadable } from '@/utils/pipeline-helpers'
import { useReapitConnect } from '@reapit/connect-session'
import {
  BodyText,
  Button,
  ButtonGroup,
  ColSplit,
  Grid,
  InputWrap,
  StatusIndicator,
  Subtitle,
  elMb3,
} from '@reapit/elements'
import { PipelineModelInterface, PipelineRunnerModelInterface } from '@reapit/foundations-ts-definitions'
import { UpdateActionNames, updateActions } from '@reapit/utils-common'
import { UpdateReturnTypeEnum, useReapitUpdate } from '@reapit/utils-react'
import React from 'react'
import { EditPipeline } from './edit-pipeline'

export const PipelineInfo: React.FC<{
  pipeline: PipelineModelInterface
  setPipeline: (pipeline: PipelineModelInterface) => void
}> = ({ pipeline, setPipeline }) => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)

  const [deleteLoading, , deleteFunc] = useReapitUpdate<void, PipelineRunnerModelInterface>({
    reapitConnectBrowserSession,
    action: updateActions(window.reapit.config.appEnv)[UpdateActionNames.deletePipeline],
    uriParams: {
      appId: pipeline.id,
    },
    method: 'DELETE',
    headers: {
      Authorization: connectSession?.idToken as string,
    },
    returnType: UpdateReturnTypeEnum.RESPONSE,
  })
  return (
    <>
      <ButtonGroup className={elMb3}>
        <EditPipeline
          pipeline={pipeline}
          appId={pipeline.appId as string}
          refreshPipeline={(pipeline) => setPipeline(pipeline)}
        />
        <Button
          loading={deleteLoading}
          intent="danger"
          disabled={pipeline.buildStatus === 'DELETING'}
          onClick={async (event) => {
            event.preventDefault()
            const result = await deleteFunc()

            if (result && typeof result !== 'boolean') setPipeline(result)
          }}
        >
          Delete Pipeline
        </Button>
      </ButtonGroup>
      <Grid>
        <ColSplit>
          <InputWrap>
            <Subtitle>Status</Subtitle>
            <BodyText>
              <StatusIndicator intent={buildStatusToIntent(pipeline.buildStatus as string)} />{' '}
              {buildStatusToReadable(pipeline.buildStatus as string)}
            </BodyText>
          </InputWrap>
          <InputWrap>
            <Subtitle>Repository</Subtitle>
            <BodyText>{pipeline.repository}</BodyText>
          </InputWrap>
          <InputWrap>
            <Subtitle>Package Manager</Subtitle>
            <BodyText>{pipeline.packageManager}</BodyText>
          </InputWrap>
        </ColSplit>
        <ColSplit>
          <InputWrap>
            <Subtitle>Build Command</Subtitle>
            <BodyText>{pipeline.buildCommand}</BodyText>
          </InputWrap>
          <InputWrap>
            <Subtitle>Location</Subtitle>
            <BodyText>{pipeline.subDomain ? `https://${pipeline.subDomain}.dev.paas.reapit.cloud` : ''}</BodyText>
          </InputWrap>
          <InputWrap>
            <Subtitle>Build dir</Subtitle>
            <BodyText>{pipeline.outDir}</BodyText>
          </InputWrap>
          <InputWrap>
            <Subtitle>Tests</Subtitle>
            <BodyText>{pipeline.testCommand || ''}</BodyText>
          </InputWrap>
        </ColSplit>
      </Grid>
    </>
  )
}
