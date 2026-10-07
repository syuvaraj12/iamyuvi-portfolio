import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret') ?? req.headers.get('x-revalidate-secret')
  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }
  revalidateTag('sanity', 'max')
  revalidatePath('/work')
  revalidatePath('/work/[slug]', 'page')
  return NextResponse.json({ revalidated: true, now: Date.now() })
}
