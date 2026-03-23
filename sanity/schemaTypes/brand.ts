export default {
    name: 'brand',
    title: 'Brand',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Brand Name',
        type: 'string',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'name',
          maxLength: 96,
        },
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'logo',
        title: 'Brand Logo',
        type: 'image',
        options: {
          hotspot: true,
        },
        fields: [
          {
            name: 'alt',
            title: 'Alternative Text',
            type: 'string',
            description: 'Important for SEO and accessibility',
          },
        ],
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'description',
        title: 'Brand Description',
        type: 'text',
        description: 'Brief description of the brand',
      },
      {
        name: 'website',
        title: 'Brand Website',
        type: 'url',
        description: 'Official brand website URL',
      },
      {
        name: 'featured',
        title: 'Featured Brand',
        type: 'boolean',
        initialValue: false,
        description: 'Show this brand in featured sections',
      },
      {
        name: 'establishedYear',
        title: 'Year Established',
        type: 'number',
        description: 'Year the brand was founded',
        validation: (Rule: any) => Rule.min(1800).max(new Date().getFullYear()),
      },
      {
        name: 'country',
        title: 'Country of Origin',
        type: 'string',
        description: 'Country where the brand originates from',
      },
    ],
    preview: {
      select: {
        title: 'name',
        media: 'logo',
        subtitle: 'country',
      },
    },
  };