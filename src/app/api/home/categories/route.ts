import { NextResponse } from 'next/server'

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5001/api/v1'

const fallbackPositions = [
  'object-[35%_34%]',
  'object-[82%_50%]',
  'object-[72%_68%]',
  'object-[52%_54%]',
  'object-[38%_20%]',
  'object-[82%_44%]',
]

type BackendCategory = {
  _id?: string
  name?: string
  image?: {
    url?: string
  }
}

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/category?parent=null`, {
      cache: 'no-store',
    })

    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            payload?.message || 'Failed to fetch categories from backend',
        },
        { status: response.status },
      )
    }

    const categories = Array.isArray(payload?.data) ? payload.data : []

    return NextResponse.json({
      items: categories
        .slice(0, 6)
        .map((item: BackendCategory, index: number) => ({
          id: item?._id || String(index + 1),
          title: item?.name || 'Category',
          image: item?.image?.url || '/images/book1.jpg',
          imagePosition: fallbackPositions[index % fallbackPositions.length],
        })),
    })
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong while fetching categories' },
      { status: 500 },
    )
  }
}
