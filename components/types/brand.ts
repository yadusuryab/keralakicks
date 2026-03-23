export interface Brand {
    _id: string;
    name: string;
    slug: { current: string };
    logo?: string;
    logoAlt?: string;
    description?: string;
    website?: string;
    featured?: boolean;
    establishedYear?: number;
    country?: string;
    _createdAt: string;
    _updatedAt: string;
  }