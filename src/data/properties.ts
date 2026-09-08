export type ListingType = 'sale' | 'rent';

export type Property = {
  id: number;
  title: string;
  location: string;
  propertyType:
    | 'Condominium'
    | 'Terrace House'
    | 'Serviced Residence'
    | 'Semi-D';
  type: ListingType;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  image: string;
  images: string[];
  address: string;
  latitude: number | null;
  longitude: number | null;
  description: string;
  packageDetails: string;
  projectInfo: string;
  amenities: string;
  featured?: boolean;
};

/** DEMO PROPERTY DATA — replace with live listing data in a future phase. */
export const properties: Property[] = [
  {
    id: 1,
    title: 'Arcoris Residences',
    location: 'Mont Kiara, Kuala Lumpur',
    propertyType: 'Serviced Residence',
    type: 'sale',
    price: 1280000,
    bedrooms: 3,
    bathrooms: 2,
    size: 1380,
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
    images: [],
    address: '',
    latitude: null,
    longitude: null,
    description: '',
    packageDetails: '',
    projectInfo: '',
    amenities: '',
    featured: true,
  },
  {
    id: 2,
    title: 'Serene Courtyard Home',
    location: 'Bangsar, Kuala Lumpur',
    propertyType: 'Terrace House',
    type: 'sale',
    price: 2480000,
    bedrooms: 4,
    bathrooms: 4,
    size: 2800,
    image:
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85',
    images: [],
    address: '',
    latitude: null,
    longitude: null,
    description: '',
    packageDetails: '',
    projectInfo: '',
    amenities: '',
  },
  {
    id: 3,
    title: 'Parkside Family Residence',
    location: 'Desa ParkCity, Kuala Lumpur',
    propertyType: 'Condominium',
    type: 'sale',
    price: 1680000,
    bedrooms: 3,
    bathrooms: 3,
    size: 1730,
    image:
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
    images: [],
    address: '',
    latitude: null,
    longitude: null,
    description: '',
    packageDetails: '',
    projectInfo: '',
    amenities: '',
  },
  {
    id: 4,
    title: 'Tropicana City Suites',
    location: 'Petaling Jaya, Selangor',
    propertyType: 'Condominium',
    type: 'rent',
    price: 3200,
    bedrooms: 2,
    bathrooms: 2,
    size: 1050,
    image:
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85',
    images: [],
    address: '',
    latitude: null,
    longitude: null,
    description: '',
    packageDetails: '',
    projectInfo: '',
    amenities: '',
    featured: true,
  },
  {
    id: 5,
    title: 'Subang Garden Home',
    location: 'Subang Jaya, Selangor',
    propertyType: 'Terrace House',
    type: 'rent',
    price: 4500,
    bedrooms: 4,
    bathrooms: 3,
    size: 2200,
    image:
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=85',
    images: [],
    address: '',
    latitude: null,
    longitude: null,
    description: '',
    packageDetails: '',
    projectInfo: '',
    amenities: '',
  },
  {
    id: 6,
    title: 'Lakefront Modern Semi-D',
    location: 'Cyberjaya, Selangor',
    propertyType: 'Semi-D',
    type: 'rent',
    price: 6800,
    bedrooms: 5,
    bathrooms: 5,
    size: 3600,
    image:
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
    images: [],
    address: '',
    latitude: null,
    longitude: null,
    description: '',
    packageDetails: '',
    projectInfo: '',
    amenities: '',
  },
];
