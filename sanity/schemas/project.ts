import { defineArrayMember, defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'client', type: 'string' }),
    defineField({
      name: 'category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'cover',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({ name: 'orderRank', type: 'number', description: 'Optional manual order' }),
    defineField({
      name: 'content',
      type: 'array',
      of: [
        defineArrayMember({ type: 'titleBlock' }),
        defineArrayMember({ type: 'subtitleBlock' }),
        defineArrayMember({ type: 'paragraphBlock' }),
        defineArrayMember({ type: 'imageBlock' }),
      ],
    }),
  ],
  orderings: [
    { title: 'Recent', name: 'recent', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'client', media: 'cover' },
  },
})
