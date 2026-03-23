// app/api/brands/route.ts
import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

export async function GET() {
  try {
    const query = groq`*[_type == "brand"] | order(name asc) {
      _id,
      name,
      slug,
      "logo": logo.asset->url,
      "logoAlt": logo.alt,
      description,
      website,
      featured,
      establishedYear,
      country,
      _createdAt,
      _updatedAt
    }`;

    const brands = await client.fetch(query);
    
    return NextResponse.json(brands, { status: 200 });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}