'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'Yuvaraj Portfolio',
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'missing',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
})
