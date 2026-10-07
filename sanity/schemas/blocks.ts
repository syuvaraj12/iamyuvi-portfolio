import { defineField, defineType } from 'sanity'

const textPreview = (title: string, icon: string) => ({
  select: { text: 'text' },
  prepare: ({ text }: { text?: string }) => ({
    title: `${icon} ${(text ?? '').slice(0, 40)}`,
    subtitle: title,
  }),
})

export const titleBlock = defineType({
  name: 'titleBlock',
  title: 'Title',
  type: 'object',
  fields: [defineField({ name: 'text', type: 'string' })],
  preview: textPreview('Title', 'H2'),
})

export const subtitleBlock = defineType({
  name: 'subtitleBlock',
  title: 'Subtitle',
  type: 'object',
  fields: [defineField({ name: 'text', type: 'string' })],
  preview: textPreview('Subtitle', 'H3'),
})

export const paragraphBlock = defineType({
  name: 'paragraphBlock',
  title: 'Paragraph',
  type: 'object',
  fields: [defineField({ name: 'text', type: 'text', rows: 6 })],
  preview: textPreview('Paragraph', '¶'),
})

export const imageBlock = defineType({
  name: 'imageBlock',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({ name: 'image', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: 'alt', type: 'string' }),
    defineField({ name: 'caption', type: 'string' }),
  ],
  preview: {
    select: { media: 'image', alt: 'alt', caption: 'caption' },
    prepare: ({ media, alt, caption }) => ({
      title: (alt || caption || 'Image').slice(0, 40),
      subtitle: 'Image',
      media,
    }),
  },
})
