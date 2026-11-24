export const company = {
  name: 'Kelley Properties, Inc.',
  shortName: 'Kelley Properties',
  tagline: 'Something for Everyone',
  phone: '(319) 365-3156',
  phoneHref: 'tel:+13193653156',
  street: '2750 1st Avenue NE, Suite 230',
  city: 'Cedar Rapids',
  region: 'IA',
  postal: '52402',
  address: '2750 1st Avenue NE, Suite 230, Cedar Rapids, IA 52402',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=2750+1st+Avenue+NE+Suite+230+Cedar+Rapids+IA+52402',
  office: { lat: 42.0043, lng: -91.6349 },
  hours: [
    { days: 'Monday – Friday', time: '8:00 a.m. – 5:00 p.m.' },
    { days: 'Saturday – Sunday', time: 'Closed' },
  ],
  hoursNote: 'Holidays may affect our business hours. Please call ahead.',
  yearsInBusiness: '30+',
  units: '500+',
};

export const nav = [
  { label: 'Find a Home', href: 'properties/' },
  { label: 'Apply', href: 'apply/' },
  { label: 'Residents', href: 'service-request/' },
  { label: 'Vacation Rentals', href: 'vacation-rentals/' },
  { label: 'About', href: 'about/' },
  { label: 'Contact', href: 'contact/' },
];

// Details and photos come from Kelley's own VRBO listings (checked Nov 2026). Ratings change — refresh before launch.
export const keyWestHomes = [
  {
    slug: 'waters-edge',
    name: "The Water's Edge",
    headline: 'Ocean breeze with coconut trees',
    location: 'Truman Annex · Key West, Florida',
    url: 'https://www.vrbo.com/327109ha?noDates=true',
    bedrooms: '3', bathrooms: '4', sleeps: '8',
    rating: '9.4', reviews: 44,
    minStay: '1-week minimum stay',
    description: [
      'Three-bedroom, four-bathroom private home with a heated pool. Breathtaking sunsets can be seen from the third-floor deck overlooking the ocean.',
      'Inside the guarded and gated Truman Annex, just three blocks from Sloppy Joe’s and the Duval Street entertainment. Watch sailboats and sunsets from the decks by day and feel refreshing ocean breezes at night.',
    ],
    amenities: ['Heated pool', 'Ocean-view deck', 'Full kitchen', 'Washer & dryer', 'Air conditioning', 'High-speed internet', 'Pet friendly'],
    photoOrder: [1, 2, 4, 3, 5],
    captions: ['The Water’s Edge', 'Top-floor deck with ocean views', 'Private heated pool', 'Main bedroom', 'Work space with high-speed internet'],
  },
  {
    slug: 'truman-treasure',
    name: 'Truman Treasure',
    headline: 'Tropical state of mind',
    location: 'Gated community · Key West, Florida',
    url: 'https://www.vrbo.com/327107ha?noDates=true',
    bedrooms: '3', bathrooms: '2½', sleeps: '5',
    rating: '9.4', reviews: 32,
    minStay: '30-night minimum stay',
    description: [
      'Private three-bedroom, two-and-a-half-bath home within a gated community, with access to a large private association pool. HD TVs in every bedroom and the living room, plus high-speed internet throughout.',
      'Well stocked with towels, bedding and household appliances. Close to the ocean and beach — only three blocks from Sloppy Joe’s and Duval Street.',
    ],
    amenities: ['Association pool', 'Ocean view', 'Full kitchen', 'Washer & dryer', 'Air conditioning', 'High-speed internet'],
    photoOrder: [3, 1, 2, 4, 5],
    captions: ['Truman Treasure', 'Tropical garden path', 'Private patio with grill', 'Living and dining area', 'Kitchen'],
  },
];

// These VRBO links no longer resolve to a listing (they redirect to VRBO area searches), so the
// new site asks guests to contact the office instead. Confirm status with the owner.
export const belizeRentals = [
  { name: 'Grande Caribe A-9' },
  { name: 'Grand Caribe CH-4', note: 'Formerly Magical Island' },
  { name: 'Sunset Caribe #1' },
  { name: 'Sunset Caribe #2' },
  { name: 'Sunset Caribe #3' },
];

/** Form submissions go to Web3Forms (free). Set PUBLIC_WEB3FORMS_KEY at build time to enable delivery. */
export const formsKey: string = import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '';

/** Prefix an internal path with the configured base. */
export const url = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
