import { sanityClient } from '@/lib/sanity'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  // ── Pagination ─────────────────────────────────────────────────────────────
  const page  = parseInt(searchParams.get('page')  || '1',  10)
  const limit = parseInt(searchParams.get('limit') || '12', 10)
  const start = (page - 1) * limit

  // ── Flags ──────────────────────────────────────────────────────────────────
  const home     = searchParams.get('home')     === 'true'
  const featured = searchParams.get('featured') === 'true'
  const onSale   = searchParams.get('onSale')   === 'true'
  const excludeSoldOut = searchParams.get('excludeSoldOut') === 'true'

  // ── Scalar filters ─────────────────────────────────────────────────────────
  const minPrice  = parseFloat(searchParams.get('minPrice')  || '0')
  const maxPrice  = parseFloat(searchParams.get('maxPrice')  || '999999')
  const minRating = parseFloat(searchParams.get('minRating') || '0')
  const category  = searchParams.get('category')
  const sort      = searchParams.get('sort') || 'newest'
  const q         = searchParams.get('q')

  // ── Array filters ──────────────────────────────────────────────────────────
  const sizes    = searchParams.get('sizes')?.split(',').filter(Boolean)    || []
  const colors   = searchParams.get('colors')?.split(',').filter(Boolean)   || []
  const features = searchParams.get('features')?.split(',').filter(Boolean) || []
  const brands   = searchParams.get('brands')?.split(',').filter(Boolean)   || []

  try {
    // ── Build conditions ─────────────────────────────────────────────────────
    const conditions: string[] = [
      '_type == "product"',
      `salesPrice >= ${minPrice}`,
      `salesPrice <= ${maxPrice}`,
    ]

    // Full-text search across name, description, features
    if (q) {
      conditions.push(
        `(name match "*${q}*" || description match "*${q}*" || pt::text(description) match "*${q}*")`
      )
    }

    // Category (by slug)
    if (category) {
      conditions.push(`category->slug.current == "${category}"`)
    }

    // Brand (by slug — matches brand.slug.current)
    if (brands.length > 0) {
      const brandList = brands.map((b) => `"${b}"`).join(', ')
      conditions.push(`brand->slug.current in [${brandList}]`)
    }

    // Sizes
    if (sizes.length > 0) {
      const sizeList = sizes.map((s) => `"${s}"`).join(', ')
      conditions.push(`count((sizes[])[@ in [${sizeList}]]) > 0`)
    }

    // Colors
    if (colors.length > 0) {
      const colorList = colors.map((c) => `"${c}"`).join(', ')
      conditions.push(`count((colors[])[@ in [${colorList}]]) > 0`)
    }

    // Features
    if (features.length > 0) {
      const featureList = features.map((f) => `"${f}"`).join(', ')
      conditions.push(`count((features[])[@ in [${featureList}]]) > 0`)
    }

    // Boolean flags
    if (featured)      conditions.push('featured == true')
    if (onSale)        conditions.push('salesPrice < price')
    if (excludeSoldOut) conditions.push('soldOut != true')
    if (minRating > 0) conditions.push(`rating >= ${minRating}`)

    // ── Sort order ────────────────────────────────────────────────────────────
    let sortOrder = ''
    switch (sort) {
      case 'price_asc':   sortOrder = '| order(salesPrice asc)';  break
      case 'price_desc':  sortOrder = '| order(salesPrice desc)'; break
      case 'rating':      sortOrder = '| order(rating desc)';     break
      case 'price-asc':   sortOrder = '| order(salesPrice asc)';  break
      case 'price-desc':  sortOrder = '| order(salesPrice desc)'; break
      default:            sortOrder = '| order(_createdAt desc)'
    }

    // ── Projection helpers ────────────────────────────────────────────────────
    // Images array: returns both image urls and video objects
    const imagesProjection = `
      "images": images[]{
        _type == "image" => {
          "_type": "image",
          "url": asset->url,
          "alt": alt,
        },
        _type == "video" => {
          "_type": "video",
          "videoUrl": videoFile.asset->url,
          "externalUrl": videoUrl,
          "poster": poster.asset->url,
          "title": title,
          "alt": alt,
        }
      }
    `

    const brandProjection = `
      "brand": brand->{
        _id,
        name,
        "slug": slug.current,
        "logo": logo.asset->url,
      }
    `

    const categoryProjection = `
      "category": category->title,
      "categorySlug": category->slug.current,
    `

    // ── Home query (featured, lightweight) ───────────────────────────────────
    if (home) {
      const query = `
        *[${conditions.join(' && ')} && featured == true]
        ${sortOrder}
        [0...4] {
          _id,
          name,
          "slug": slug.current,
          "image": images[0].asset->url,
          price,
          salesPrice,
          rating,
          featured,
          soldOut,
          quantity,
          ${categoryProjection}
          ${brandProjection}
        }
      `
      const products = await sanityClient.fetch(query)
      return NextResponse.json({
        success: true,
        data: products,
        pagination: { page: 1, limit: 4, total: products.length, hasNextPage: false },
      })
    }

    // ── Full listing query ────────────────────────────────────────────────────
    const whereClause = conditions.join(' && ')

    const query = `
      *[${whereClause}]
      ${sortOrder}
      [${start}...${start + limit}] {
        _id,
        name,
        "slug": slug.current,
        "image": images[0].asset->url,
        ${imagesProjection},
        price,
        salesPrice,
        sizes,
        colors,
        features,
        description,
        featured,
        soldOut,
        quantity,
        rating,
        ${categoryProjection}
        ${brandProjection}
      }
    `

    const [products, total] = await Promise.all([
      sanityClient.fetch(query),
      sanityClient.fetch(`count(*[${whereClause}])`),
    ])

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        hasNextPage: start + limit < total,
      },
    })
  } catch (error) {
    console.error('[/api/product] Error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Fetch failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}