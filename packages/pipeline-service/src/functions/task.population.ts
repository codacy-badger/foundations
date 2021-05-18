import { PipelineModel, TaskModel } from '@/models'
import { createBatchTasks } from '@/services'
import { AppTypeEnum, DeploymentModelInterface, TaskRunnerFunctions } from '@reapit/foundations-ts-definitions'
import { Handler, Context, Callback } from 'aws-lambda'
import { AttributeMap } from 'aws-sdk/clients/dynamodb'

const workflowCreation = async (
  pipeline: PipelineModel,
  deployment: DeploymentModelInterface,
): Promise<TaskModel[]> => {
  const batchTasks: (Partial<TaskModel> & { pipelineId: string })[] =
    deployment.appType !== AppTypeEnum.NODE
      ? [
          {
            pipelineId: pipeline.id as string,
            functionName: TaskRunnerFunctions.PULL,
          },
          {
            pipelineId: pipeline.id as string,
            functionName: TaskRunnerFunctions.BUILD,
          },
          {
            pipelineId: pipeline.id as string,
            functionName: TaskRunnerFunctions.DEPLOY_LAMBDAS,
          },
        ]
      : [
          {
            pipelineId: pipeline.id as string,
            functionName: TaskRunnerFunctions.PULL,
          },
          {
            pipelineId: pipeline.id as string,
            functionName: TaskRunnerFunctions.BUILD,
          },
          {
            pipelineId: pipeline.id as string,
            functionName: TaskRunnerFunctions.DEPLOY_REACT,
          },
        ]

  return createBatchTasks(batchTasks)
}

export const taskPopulation: Handler = async (event: any, context: Context, callback: Callback): Promise<void> => {
  await Promise.all(
    event.Records.map((record) => {
      const pipeline: AttributeMap = record.dynamodb.NewImage

      console.log(pipeline)

      // TODO find deployment for all deployment settings OR find deployment on pipeline creation and sync settings?
      const deployment: DeploymentModelInterface = {
        id: '',
        appType: AppTypeEnum.NODE,
      }

      return workflowCreation(pipeline, deployment)
    }),
  )

  return callback(null, `Successfully processed ${event.Records.length} records.`)
}
