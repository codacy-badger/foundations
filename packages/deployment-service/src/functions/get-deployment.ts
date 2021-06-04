import { httpHandler, NotFoundException } from '@homeservenow/serverless-aws-handler'
import { DeploymentModel } from '@/models'
import * as service from '@/services/deployment'
import { ownership } from '@/utils'
import { resolveDeveloperId } from '@/utils/resolve-developer-id'

/**
 * Get a deployment by id
 */
export const getDeployment = httpHandler({
  handler: async ({ event }): Promise<DeploymentModel> => {
    const developerId = await resolveDeveloperId(event)

    const deployment = await service.getByKey(event.pathParameters?.id as string)

    if (!deployment) {
      throw new NotFoundException()
    }

    await ownership(deployment.developerId, developerId)

    return deployment
  },
})
