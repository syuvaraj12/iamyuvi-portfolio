import { Suspense } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProjectGrid from '@/components/ProjectGrid'
import { safeFetch } from '@/lib/sanity'
import { categoriesQuery, projectsQuery, type Category, type ProjectCard } from '@/lib/queries'

export const revalidate = 60

export default async function WorkPage() {
  const [projects, categories] = await Promise.all([
    safeFetch<ProjectCard[]>(projectsQuery, {}, []),
    safeFetch<Category[]>(categoriesQuery, {}, []),
  ])
  return (
    <div className="min-h-screen">
      <Header />
      <Suspense>
        <ProjectGrid projects={projects} categories={categories} />
      </Suspense>
      <Footer />
    </div>
  )
}
