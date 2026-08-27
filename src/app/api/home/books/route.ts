import { NextResponse } from 'next/server'

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5001/api/v1'

type BackendBook = {
  _id?: string
  title?: string
  author?: string
  price?: number
  avgRating?: number
  coverImage?: string
  category?: {
    _id?: string
    name?: string
  }
  shopId?: {
    name?: string
  }
}

type BackendBooksPayload = {
  data?: {
    books?: BackendBook[]
    meta?: {
      page?: number
      limit?: number
      total?: number
      totalPage?: number
    }
  }
  message?: string
}

function shuffleArray<T>(items: T[]) {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function mapBook(item: BackendBook, index: number) {
  const ratingValue = Number(item?.avgRating ?? 0)

  return {
    id: item?._id || String(index + 1),
    categoryId: item?.category?._id || '',
    title: item?.title || 'Untitled',
    author: item?.author || 'Unknown Author',
    location: item?.shopId?.name || 'Bookstore',
    price: `£ ${Number(item?.price || 0).toFixed(2)}`,
    rating: ratingValue > 0 ? ratingValue.toFixed(1) : '0.0',
    image: item?.coverImage || '/images/book1.jpg',
    imagePosition: 'object-center',
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const kind = searchParams.get('kind') || 'featured'
    const page = Number(searchParams.get('page') || '1')
    const limit = Number(searchParams.get('limit') || '8')
    const category = searchParams.get('category')
    const search = searchParams.get('search')?.trim()
    const selectedCategories = category
      ? category
          .split(',')
          .map(value => value.trim())
          .filter(Boolean)
      : []

    const sortBy = 'createdAt'
    const sortOrder = 'desc'

    const backendQuery = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortBy,
      sortOrder,
    })
    if (search) {
      backendQuery.set('search', search)
    }

    const fetchBooks = async (categoryId?: string) => {
      const query = new URLSearchParams(backendQuery)
      if (categoryId) {
        query.set('category', categoryId)
      }
      const res = await fetch(`${BACKEND_BASE_URL}/books?${query.toString()}`, {
        cache: 'no-store',
      })
      const data = (await res
        .json()
        .catch(() => null)) as BackendBooksPayload | null
      return { res, data }
    }

    if (selectedCategories.length > 1) {
      const multiFetchLimit = 50
      const multiQuery = new URLSearchParams({
        page: '1',
        limit: String(multiFetchLimit),
        sortBy,
        sortOrder,
      })

      const results = await Promise.all(
        selectedCategories.map(async categoryId => {
          const query = new URLSearchParams(multiQuery)
          query.set('category', categoryId)
          const res = await fetch(
            `${BACKEND_BASE_URL}/books?${query.toString()}`,
            {
              cache: 'no-store',
            },
          )
          const data = (await res
            .json()
            .catch(() => null)) as BackendBooksPayload | null
          return { res, data }
        }),
      )

      const failed = results.find(item => !item.res.ok)
      if (failed) {
        return NextResponse.json(
          {
            message:
              failed.data?.message || 'Failed to fetch books from backend',
          },
          { status: failed.res.status },
        )
      }

      const merged = results.flatMap(item =>
        Array.isArray(item.data?.data?.books) ? item.data!.data!.books! : [],
      )
      const deduped = Array.from(
        new Map(merged.map(item => [item._id || Math.random(), item])).values(),
      )

      const processed = kind === 'popular' ? shuffleArray(deduped) : deduped
      const start = (page - 1) * limit
      const paginated = processed.slice(start, start + limit)
      const total = deduped.length
      const totalPage = Math.max(1, Math.ceil(total / limit))

      return NextResponse.json({
        items: paginated.map(mapBook),
        meta: {
          page,
          limit,
          total,
          totalPage,
        },
      })
    }

    const { res: response, data: payload } = await fetchBooks(
      selectedCategories[0],
    )

    if (!response.ok) {
      return NextResponse.json(
        { message: payload?.message || 'Failed to fetch books from backend' },
        { status: response.status },
      )
    }

    const books = Array.isArray(payload?.data?.books) ? payload.data.books : []
    const processedBooks = kind === 'popular' ? shuffleArray(books) : books
    const meta = payload?.data?.meta

    return NextResponse.json({
      items: processedBooks.map(mapBook),
      meta: {
        page: Number(meta?.page || page),
        limit: Number(meta?.limit || limit),
        total: Number(meta?.total || processedBooks.length),
        totalPage: Number(meta?.totalPage || 1),
      },
    })
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong while fetching books' },
      { status: 500 },
    )
  }
}
