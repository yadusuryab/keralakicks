export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'images', // KEEP this name for backward compatibility
      title: 'Product Images & Videos',
      type: 'array',
      of: [
        { 
          type: 'image', 
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
              description: 'Important for SEO and accessibility',
            }
          ]
        },
        {
          type: 'object',
          name: 'video',
          title: 'Video',
          fields: [
            {
              name: 'videoFile',
              title: 'Video File',
              type: 'file',
              options: {
                accept: 'video/*',
              },
            },
            {
              name: 'videoUrl',
              title: 'Video URL (YouTube/Vimeo)',
              type: 'url',
              description: 'Optional: For YouTube/Vimeo embeds',
            },
            {
              name: 'poster',
              title: 'Video Poster',
              type: 'image',
              options: {
                hotspot: true,
              },
              description: 'Thumbnail image for the video',
            },
            {
              name: 'title',
              title: 'Video Title (Optional)',
              type: 'string',
            },
            {
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
              description: 'Description for accessibility',
            },
          ],
          preview: {
            select: {
              title: 'title',
              media: 'poster',
              subtitle: 'videoUrl',
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'salesPrice',
      title: 'Sales Price',
      type: 'number',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'colors',
      title: 'Available Colors',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List available colors (e.g., Red, Blue, Black)',
    },
    {
      name: 'features',
      title: 'Key Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List key features (like material, design, fit, etc.)',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'brand',  // NEW: Brand reference
      title: 'Brand',
      type: 'reference',
      to: [{ type: 'brand' }],
      description: 'Select the brand for this product',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    },
    {
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'buyOneGetOne',  // NEW: Buy One Get One toggle
      title: 'Buy One Get One (BOGO)',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle to enable Buy One Get One offer on this product',
    },
    {
      name: 'quantity',
      title: 'Stock Quantity',
      type: 'number',
      validation: (Rule: any) => Rule.min(0),
    },
    {
      name: 'soldOut',
      title: 'Sold Out',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'rating',
      title: 'Average Rating',
      type: 'number',
      description: 'Average rating out of 5 (e.g., 4.3)',
      validation: (Rule: any) => Rule.min(0).max(5),
    },
  ],
};