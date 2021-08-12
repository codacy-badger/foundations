import { httpHandler, NotFoundException } from '@homeservenow/serverless-aws-handler'
import { PipelineEntity } from './../../entities'
import * as service from './../../services/pipeline'
import { ownership, resolveCreds } from './../../utils'
import { defaultOutputHeaders } from './../../constants'

/**
 * Get a pipeline by id
 */
export const pipelineGet = httpHandler({
  defaultOutputHeaders,
  handler: async ({ event }): Promise<PipelineEntity> => {
    const { developerId } = await resolveCreds(event)

    const pipeline = await service.findPipelineById(event.pathParameters?.pipelineId as string)

    if (!pipeline) {
      throw new NotFoundException()
    }

    await ownership(pipeline.developerId, developerId)

    return pipeline
  },
})
