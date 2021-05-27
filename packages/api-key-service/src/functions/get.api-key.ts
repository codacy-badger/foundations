import { ApiKeyModel } from '@/models'
import { httpHandler, UnauthorizedException } from '@homeservenow/serverless-aws-handler'
import { connectSessionVerifyDecodeIdTokenWithPublicKeys, LoginIdentity } from '@reapit/connect-session'
import { getApiKey as get } from './../services'
import publicKeys from './../../publicKeys.json'

export const getApiKey = httpHandler<void, ApiKeyModel>({
  handler: async ({ event }) => {
    let customer: LoginIdentity | undefined

    try {
      customer = await connectSessionVerifyDecodeIdTokenWithPublicKeys(
        event.headers?.Authorization as string,
        process.env.CONNECT_USER_POOL as string,
        publicKeys,
      )

      if (typeof customer === 'undefined') {
        throw new Error('Unauthorised')
      }
    } catch (e) {
      throw new UnauthorizedException(e.message)
    }

    return get({
      id: event.pathParameters?.id,
      developerId: customer?.developerId ? customer.developerId : undefined,
      organisationId: customer?.orgId ? customer.orgId : undefined,
    })
  },
})
