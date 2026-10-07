import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'missing'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
})

const builder = createImageUrlBuilder({ projectId, dataset })
export const urlFor = (source: any) => builder.image(source)

export async function safeFetch<T>(query: string, params: Record<string, unknown>, fallback: T): Promise<T> {
  if (projectId === 'missing') return fallback
  try {
    return await client.fetch<T>(query, params, { next: { revalidate: 60, tags: ['sanity'] } })
  } catch (e) {
    console.error('Sanity fetch failed', e)
    return fallback
  }
}
