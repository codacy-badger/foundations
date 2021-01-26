import { fetcher } from '@reapit/elements'
import { URLS } from '../constants/api'
import { CreateTransactionModel } from '../types/opayo'
import { genPaymentsHeaders } from '../utils/headers'

export interface MerchantKey {
  merchantSessionKey: string
  expiry: string
}

export const opayoCreateTransactionService = async (
  clientCode: string,
  transaction: CreateTransactionModel,
): Promise<MerchantKey | undefined> => {
  try {
    const response: MerchantKey | undefined = await fetcher({
      api: window.reapit.config.paymentsApiUrl,
      url: `${URLS.TRANSACTIONS}`,
      method: 'POST',
      headers: genPaymentsHeaders(clientCode),
      body: transaction,
    })

    if (response) {
      return response
    }

    throw new Error('No merchant key returned')
  } catch (err) {
    console.error('Error fetching properties', err.message)
  }
}
