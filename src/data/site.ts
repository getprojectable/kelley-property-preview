export const company = {
  name: 'Kelley Properties, Inc.',
  shortName: 'Kelley Properties',
  tagline: 'Something for Everyone',
  phone: '(319) 365-3156',
  phoneHref: 'tel:+13193653156',
  fax: '(319) 365-3306',
  street: '2750 1st Avenue NE, Suite 230',
  city: 'Cedar Rapids',
  region: 'IA',
  postal: '52402',
  address: '2750 1st Avenue NE, Suite 230, Cedar Rapids, IA 52402',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=2750+1st+Avenue+NE+Suite+230+Cedar+Rapids+IA+52402',
  office: { lat: 42.0043, lng: -91.6349 },
  hours: [
    { days: 'Monday – Friday', time: '8:00 a.m. – 5:00 p.m.' },
    { days: 'Saturday', time: '9:00 a.m. – 3:00 p.m.' },
    { days: 'Sunday', time: 'Closed' },
  ],
  hoursNote: 'Holidays may affect our business hours. Please call ahead.',
  yearsInBusiness: '30+',
  units: '1,000+',
};

export const nav = [
  { label: 'Find a Home', href: 'properties/' },
  { label: 'Apply', href: 'apply/' },
  { label: 'Residents', href: 'service-request/' },
  { label: 'Vacation Rentals', href: 'vacation-rentals/' },
  { label: 'About', href: 'about/' },
  { label: 'Contact', href: 'contact/' },
];

// Blurbs are intentionally generic; replace with owner-approved descriptions before launch.
export const vacationRentals = [
  { name: "The Water's Edge", url: 'https://www.vrbo.com/327109ha?noDates=true', blurb: 'Tropical vacation rental. See photos, rates and availability on VRBO.' },
  { name: 'Truman Treasure', url: 'https://www.vrbo.com/327107ha?noDates=true', blurb: 'Tropical vacation rental. See photos, rates and availability on VRBO.' },
  { name: 'Grande Caribe A-9', url: 'https://www.vrbo.com/481705?adultsCount=6&noDates=true', blurb: 'Grande Caribe resort condo. See photos, rates and availability on VRBO.' },
  { name: 'Grand Caribe CH-4', note: 'Formerly Magical Island', url: 'https://www.vrbo.com/327107ha?noDates=true', blurb: 'Grand Caribe resort condo. See photos, rates and availability on VRBO.' },
  { name: 'Sunset Caribe #1', url: 'https://www.vrbo.com/2335724?adultsCount=6&noDates=true', blurb: 'Sunset Caribe condo. See photos, rates and availability on VRBO.' },
  { name: 'Sunset Caribe #2', url: 'https://www.vrbo.com/2334022?adultsCount=6', blurb: 'Sunset Caribe condo. See photos, rates and availability on VRBO.' },
  { name: 'Sunset Caribe #3', url: 'https://www.vrbo.com/2337048?adultsCount=6&noDates=true', blurb: 'Sunset Caribe condo. See photos, rates and availability on VRBO.' },
  { name: 'Belize Investment Condos', url: 'https://puestadelsolresort.com/', blurb: 'Condo ownership opportunities at Puesta del Sol Resort in Belize.', investment: true },
];

/** Form submissions go to Web3Forms (free). Set PUBLIC_WEB3FORMS_KEY at build time to enable delivery. */
export const formsKey: string = import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '';

/** Prefix an internal path with the configured base. */
export const url = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
