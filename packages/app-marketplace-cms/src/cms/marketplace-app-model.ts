import { attribute, table, autoGeneratedHashKey } from '@aws/dynamodb-data-mapper-annotations'
import {
  AppBrowseLiveDataInterface,
  AppsBrowseConfigItemContentInterface,
  AppsBrowseConfigItemFiltersInterface,
  AppsBrowseConfigEnum,
  AppsBrowseConfigItemInterface,
} from '@reapit/foundations-ts-definitions'
import { Transform, Type } from 'class-transformer'

class AppBrowseLiveDataModel implements AppBrowseLiveDataInterface {
  @attribute()
  @Transform((value) => {
    return value.value instanceof Date ? value.value.toISOString() : value.value
  })
  timeFrom?: string

  @attribute()
  @Transform((value) => {
    return value.value instanceof Date ? value.value.toISOString() : value.value
  })
  timeTo?: string

  @attribute({ defaultProvider: () => false })
  isLive: boolean
}

class AppBrowseConfigContentModel implements AppsBrowseConfigItemContentInterface {
  @attribute()
  brandColour?: string

  @attribute()
  strapline?: string

  @attribute()
  imageUrl?: string

  @attribute()
  title?: string

  @attribute()
  iconName?: string
}

class AppsBrowseConfigItemFiltersModel implements AppsBrowseConfigItemFiltersInterface {
  @attribute()
  developerId?: string

  @attribute()
  category?: string[]

  @attribute()
  desktopIntegrationTypeId?: string[]

  @attribute()
  id?: string[]

  @attribute()
  appName?: string

  @attribute()
  isFeatured?: boolean

  @attribute()
  isFree?: boolean
}

@table(process.env.DYNAMO_MARKETPLACE_CMS_TABLE_NAME || 'Marketplace_Cms_Table')
export class MarketplaceAppModel implements AppsBrowseConfigItemInterface {
  @autoGeneratedHashKey()
  id?: string

  @attribute()
  name?: string

  @attribute()
  @Type(() => AppBrowseLiveDataModel)
  live: AppBrowseLiveDataModel

  @attribute()
  configType: AppsBrowseConfigEnum

  @attribute()
  content?: AppBrowseConfigContentModel

  @attribute()
  filters: AppsBrowseConfigItemFiltersModel

  @attribute()
  index: number
}
