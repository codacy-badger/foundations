import {
  BodyText,
  InputWrap,
  InputAddOn,
  InputGroup,
  Label,
  PersistantNotification,
  Select,
  FormLayout,
  elFadeIn,
} from '@reapit/elements'
import React, { FC } from 'react'
import { DeepMap, FieldError, UseFormRegister } from 'react-hook-form'
import { CreateWebhookFormSchema } from './webhooks-new'
import { WebhookQueryParams } from './webhooks'
import { AppSummaryModel } from '@reapit/foundations-ts-definitions'

interface WebhooksNewAppProps {
  register: UseFormRegister<CreateWebhookFormSchema>
  errors: DeepMap<Partial<CreateWebhookFormSchema>, FieldError>
  webhookQueryParams: WebhookQueryParams
  apps: AppSummaryModel[]
}

export const WebhooksNewApp: FC<WebhooksNewAppProps> = ({ register, apps, errors, webhookQueryParams }) => {
  const errorMessage = errors?.applicationId?.message
  return (
    <>
      <BodyText hasGreyText hasSectionMargin>
        First select an app to receive your webhook. Webhooks subscriptions can be set up for any customer who has
        installed your application. Additionally, you can choose ‘SBOX’ to listen for sandbox environment notifications.
      </BodyText>
      <FormLayout className={elFadeIn}>
        <InputWrap>
          {apps && apps.length ? (
            <>
              <InputGroup>
                <Select {...register('applicationId')} defaultValue={webhookQueryParams.applicationId ?? ''}>
                  <option key="default-option" value="">
                    None selected
                  </option>
                  {apps.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.name}
                    </option>
                  ))}
                </Select>
                <Label>Please select an app</Label>
                {errorMessage && <InputAddOn intent="danger">{errorMessage}</InputAddOn>}
              </InputGroup>
            </>
          ) : (
            <PersistantNotification isFullWidth isExpanded intent="secondary" isInline>
              No apps found. This is probably because you have not yet created an app from the apps page. When you have
              created your first app, you will be able to add a webhook here.
            </PersistantNotification>
          )}
        </InputWrap>
      </FormLayout>
    </>
  )
}
