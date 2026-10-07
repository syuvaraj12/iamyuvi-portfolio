import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'badge', type: 'string', description: 'Short card label: APP, DASHBOARD, MOBILE' }),
    defineField({ name: 'order', type: 'number' }),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
})
