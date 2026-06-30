import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5001/api/v1'

type BackendReview = {
  _id?: string
  rating?: number
  comment?: string
  createdAt?: string
  user?: {
    name?: string
  }
}

type BackendBook = {
  _id?: string
  title?: string
  shopId?: {
    name?: string
  }
  reviews?: BackendReview[]
}

type BackendBooksPayload = {
  data?: {
    books?: BackendBook[]
  }
  message?: string
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const token = session?.user?.accessToken

    if (!token) {
      return NextResponse.json({ items: [] })
    }

    const query = new URLSearchParams({
      page: '1',
      limit: '24',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    })

    const response = await fetch(`${BACKEND_BASE_URL}/books?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    })

    const payload = (await response
      .json()
      .catch(() => null)) as BackendBooksPayload | null

    if (!response.ok) {
      return NextResponse.json(
        { message: payload?.message || 'Failed to fetch reviews from backend' },
        { status: response.status },
      )
    }

    const books = Array.isArray(payload?.data?.books) ? payload.data.books : []

    const reviews = books
      .flatMap(book =>
        (book.reviews || []).map(review => ({
          id: review._id || `${book._id}-${Math.random()}`,
          name: review.user?.name || 'Reader',
          role: book.shopId?.name || 'Verified Buyer',
          review: review.comment || 'Great book and quick delivery experience.',
          rating: Math.max(1, Math.min(5, Number(review.rating || 5))),
          createdAt: review.createdAt || '',
        })),
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6)

    return NextResponse.json({ items: reviews })
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong while fetching reviews' },
      { status: 500 },
    )
  }
}
