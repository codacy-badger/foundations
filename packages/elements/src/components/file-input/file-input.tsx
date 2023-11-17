import React, {
  ChangeEvent,
  Dispatch,
  forwardRef,
  LegacyRef,
  SetStateAction,
  useState,
  MouseEvent,
  useEffect,
  useMemo,
  FC,
} from 'react'
import { generateRandomId } from '../../storybook/random-id'
import { elMr4 } from '../../styles/spacing'
import { Button } from '../button'
import { Icon } from '../icon'
import { Label } from '../label'
import { FlexContainer } from '../layout'
import { handleSetNativeInput } from '../multi-select'
import { SmallText } from '../typography'
import {
  ElFileInput,
  ElFileInputHidden,
  ElFileInputIconContainer,
  ElFileInputWrap,
  ElFilePreviewImage,
} from './__styles__'
import { PlaceholderImage } from '../placeholder-image'

export interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileUpload?: (uploadImageModel: CreateImageUploadModel) => Promise<any | ImageUploadModel>
  onFileView?: (base64: string) => void
  placeholderText?: string
  defaultValue?: string
  label?: string
  fileName?: string
}

export interface FilePreviewImageProps {
  src?: string | null
}

export type FileInputWrapped = React.ForwardRefExoticComponent<
  FileInputProps & React.RefAttributes<React.InputHTMLAttributes<HTMLInputElement>>
>

export interface CreateImageUploadModel {
  name?: string
  imageData?: string
}

export interface ImageUploadModel {
  Url: string
}

export const handleFileChange = (
  setFileName: Dispatch<SetStateAction<string>>,
  fileName: string,
  onFileUpload?: (uploadImageModel: CreateImageUploadModel) => Promise<string | ImageUploadModel>,
) => (event: ChangeEvent<HTMLInputElement>) => {
  if (event.target && event.target.files && event.target.files[0]) {
    const file = event.target.files[0]

    const fileUrl = URL.createObjectURL(file)

    if (typeof fileUrl === 'string') {
      setFileName(fileUrl)
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      const base64 = reader.result

      if (onFileUpload && typeof base64 === 'string') {
        const uploaded = await onFileUpload({
          imageData: base64,
          name: `${fileName ? fileName : file.name}`,
        })

        if (uploaded && (uploaded as ImageUploadModel).Url) {
          setFileName((uploaded as ImageUploadModel).Url)
        }
      }
    }
    reader.onerror = (error) => {
      console.error(`file upload error: ${error}`)
    }

    return reader
  }
}

export const handleFileClear = (setFileName: Dispatch<SetStateAction<string>>) => (
  event: MouseEvent<HTMLSpanElement>,
) => {
  event.stopPropagation()
  event.preventDefault()

  setFileName('')
}

export const handleFileView = (onFileView: (fileUrl: string) => void, fileUrl: string) => (
  event: MouseEvent<HTMLSpanElement>,
) => {
  event.stopPropagation()
  event.preventDefault()
  onFileView(fileUrl)
}

export const FilePreviewImage: FC<FilePreviewImageProps> = ({ src }) => {
  if (!src) return <PlaceholderImage placeholder="placeholderSmall" size={120} fillAvailable />

  return <ElFilePreviewImage src={src} />
}

export const FileInput: FileInputWrapped = forwardRef(
  (
    { onFileView, onFileUpload, defaultValue, label, placeholderText, fileName = '', accept, id, ...rest },
    ref: React.ForwardedRef<React.InputHTMLAttributes<HTMLInputElement>>,
  ) => {
    const [fileUrl, setFileName] = useState<string>(defaultValue ?? '')

    const inputId = useMemo(() => {
      if (id) return id
      return generateRandomId()
    }, [id])

    useEffect(handleSetNativeInput(inputId, [fileUrl]), [fileUrl])

    useEffect(() => {
      if (defaultValue) {
        setFileName(defaultValue)
      }
    }, [defaultValue])

    return (
      <ElFileInputWrap>
        {label && <Label>{label}</Label>}
        <FlexContainer isFlexAlignCenter>
          <Button className={elMr4} type="button">
            {fileUrl ? 'Change' : 'Upload'}
          </Button>
          <ElFileInput
            data-testid="el-file-input"
            accept={accept}
            type="file"
            onChange={handleFileChange(setFileName, fileName, onFileUpload)}
          />
          <ElFileInputHidden
            id={inputId}
            {...rest}
            defaultValue={defaultValue}
            ref={(ref as unknown) as LegacyRef<HTMLInputElement>}
          />
          {fileUrl ? (
            <ElFileInputIconContainer>
              {onFileView && (
                <Icon
                  onClick={handleFileView(onFileView, fileUrl)}
                  className={elMr4}
                  intent="primary"
                  icon="view"
                  fontSize="1rem"
                />
              )}
              <Icon
                onClick={handleFileClear(setFileName)}
                className={elMr4}
                intent="primary"
                icon="close"
                fontSize="1rem"
              />
            </ElFileInputIconContainer>
          ) : (
            <SmallText hasGreyText hasNoMargin>
              {placeholderText ?? 'Upload File'}
            </SmallText>
          )}
        </FlexContainer>
      </ElFileInputWrap>
    )
  },
)
