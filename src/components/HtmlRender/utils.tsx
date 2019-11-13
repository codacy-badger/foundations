import * as React from 'react'
import { H4, H5 } from '../Typography'

export interface Element {
  type: string
  tagName?: string
  children?: Element[]
  attributes?: any
  content?: string
}

const sortContentType = (domItem: Element, index: number, diffing: boolean) =>
  domItem.type === 'text' ? domItem.content || null : rendererModule.sortTags(domItem, index, diffing)

const getChildren = (domTag: Element, diffing: boolean) =>
  domTag.children
    ? domTag.children.map((child: Element, index: number) => rendererModule.sortContentType(child, index, diffing))
    : null

const getAttributes = (domTag: Element, index: number) => {
  const attributes = domTag.attributes || {}
  return { ...attributes, style: {}, key: index }
}

const sortTags = (domTag: Element, index: number, diffing: boolean) => {
  const children = rendererModule.getChildren(domTag, diffing)
  const attributes = rendererModule.getAttributes(domTag, index)
  if (!children || !children.length) {
    return null
  }
  switch (domTag.tagName) {
    case 'p':
      return <p {...attributes}>{children}</p>
    case 'a':
      return <a {...attributes}>{children}</a>
    case 'b':
      return <b {...attributes}>{children}</b>
    case 'u':
      return <u {...attributes}>{children}</u>
    case 'ul':
      return <ul {...attributes}>{children}</ul>
    case 'ol':
      return <ol {...attributes}>{children}</ol>
    case 'li':
      return <li {...attributes}>{children}</li>
    case 'h1':
      return <H4 {...attributes}>{children}</H4>
    case 'h2':
      return <H5 {...attributes}>{children}</H5>
    case 'i':
      return <i {...attributes}>{children}</i>
    case 'strike':
      return <del {...attributes}>{children}</del>
    case 'blockquote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'pre':
      return <pre {...attributes}>{children}</pre>
    case 'hr':
      return <hr {...attributes} />
    case 'ins':
      return diffing ? <ins {...attributes}>{children}</ins> : <div {...attributes}>{children}</div>
    case 'del':
      return diffing ? (
        <del className="del-diff" {...attributes}>
          {children}
        </del>
      ) : (
        <div {...attributes}>{children}</div>
      )
    default:
      return <div {...attributes}>{children}</div>
  }
}

const renderer = (domContent: Element[], diffing: boolean) =>
  domContent.map((domItem: Element, index: number) => rendererModule.sortContentType(domItem, index, diffing))

export const rendererModule = {
  sortContentType,
  getChildren,
  getAttributes,
  sortTags,
  renderer
}
export default renderer
