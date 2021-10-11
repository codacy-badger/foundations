import { reapitConnectBrowserSession } from '../core/connect-session'
import { URLS } from '../constants/api'
import { fetcher } from '@reapit/utils-common'
import { getPlatformHeaders, logger } from '@reapit/utils-react'

interface UpdateUserGroupParams {
  id: string
  userId: string
}

export const addMemberToGroup = async (group: UpdateUserGroupParams): Promise<any | undefined> => {
  try {
    const headers = await getPlatformHeaders(reapitConnectBrowserSession)
    if (headers) {
      const response = await fetcher({
        api: window.reapit.config.platformApiUrl,
        url: `${URLS.USERS_GROUPS}/${group.id}/members`,
        method: 'POST',
        headers,
        body: group,
      })

      if (response) {
        return response
      }

      throw new Error('Adding member to group failed')
    }
  } catch (err) {
    logger(err)
  }
}

export const removeMemberFromGroup = async (group: UpdateUserGroupParams): Promise<any | undefined> => {
  try {
    const headers = await getPlatformHeaders(reapitConnectBrowserSession, 'latest')
    if (headers) {
      const response = await fetcher({
        api: window.reapit.config.platformApiUrl,
        url: `${URLS.USERS_GROUPS}/${group.id}/members/${group.userId}`,
        method: 'DELETE',
        headers,
        body: group,
      })

      if (response) {
        return response
      }

      throw new Error('Removing member from group failed')
    }
  } catch (err) {
    logger(err)
  }
}
