const card = `
  _id, title, "slug": slug.current, client, publishedAt,
  category->{title, badge},
  cover{..., asset->{url, metadata{dimensions}}}
`

export const projectsQuery = `*[_type == "project" && defined(slug.current)] | order(publishedAt desc){${card}}`

export const categoriesQuery = `*[_type == "category"] | order(order asc){_id, title, badge}`

export const slugsQuery = `*[_type == "project" && defined(slug.current)]{"slug": slug.current}`

export const projectQuery = `*[_type == "project" && slug.current == $slug][0]{
  ${card},
  content[]{
    ...,
    image{..., asset->{url, metadata{dimensions}}}
  }
}`

export const siblingsQuery = `*[_type == "project" && defined(slug.current)] | order(publishedAt desc){title, "slug": slug.current, client, cover{..., asset->{url, metadata{dimensions}}}}`

export type Cover = { asset?: { url: string; metadata?: { dimensions?: { width: number; height: number } } } }
export type Category = { _id?: string; title: string; badge?: string }
export type ProjectCard = {
  _id: string
  title: string
  slug: string
  client?: string
  publishedAt?: string
  category?: Category
  cover?: Cover
}
export type Block =
  | { _type: 'titleBlock' | 'subtitleBlock' | 'paragraphBlock'; _key: string; text?: string }
  | { _type: 'imageBlock'; _key: string; alt?: string; caption?: string; image?: Cover }
export type ProjectDetail = ProjectCard & { content?: Block[] }
