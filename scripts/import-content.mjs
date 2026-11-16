// One-time import of listings from the legacy WordPress site (data captured in raw-properties.json).
// Usage: node scripts/import-content.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const raw = JSON.parse(await fs.readFile(path.join(root, 'scripts', 'raw-properties.json'), 'utf8'));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36';

// Addresses and coordinates come from each legacy property page ("Address:" line + its Google map pin).
// Two legacy pages had a placeholder pin (26.01, -80.14 in Florida); those use geocoded coordinates instead.
const geo = {
  '320-blairs-ferry-road-b-hiawatha-ia-52233': { lat: 42.0350, lng: -91.6674, address: '320 Blairs Ferry Road #B, Hiawatha, IA 52233' },
  'sierra-dr-apartments': { lat: 42.003167, lng: -91.668493, address: '1421 Sierra Drive NE, Cedar Rapids, IA 52402' },
  'peartree-apartments-2': { lat: 41.957281, lng: -91.695588, address: '2120 Rockford Road SW, Cedar Rapids, IA 52404' },
  'peartree-apartments': { lat: 41.957281, lng: -91.695588, address: '2120 Rockford Road SW, Cedar Rapids, IA 52404' },
  'wedgewood-apartments': { lat: 42.028946, lng: -91.622269, address: '190 Ridge Drive, Marion, IA 52302' },
  'oakridge-terrace': { lat: 41.9695666, lng: -91.6210934, address: '3130 Pioneer Avenue SE, Cedar Rapids, IA 52403' },
  '6800-devonshire-dr-ne': { lat: 42.045645, lng: -91.636251, address: '6800 Devonshire Drive NE, Cedar Rapids, IA 52402' },
  'lamplight-terrace': { lat: 42.000341, lng: -91.661927, address: '1124 Center Point Road NE, Cedar Rapids, IA 52402' },
  'monarch-estate-apartments': { lat: 41.958604, lng: -91.650637, address: '2231 C Street SW, Cedar Rapids, IA 52404' },
  'monarch-estates-townhouses': { lat: 41.959179, lng: -91.651475, address: '2211 C Street SW, Cedar Rapids, IA 52404' },
  'camelot-apartments': { lat: 42.035432, lng: -91.6671913, address: '310 C Avenue, Hiawatha, IA 52233' },
  'colonial-house': { lat: 42.024772, lng: -91.617301, address: '910 Bridgit Lane, Cedar Rapids, IA 52403' },
  'village-2-bedroom-1-bath-units': { lat: 41.958908, lng: -91.657118, address: '25 Aossey Lane SW, Cedar Rapids, IA 52404' },
  'village-1-bedroom-1-bath-units': { lat: 41.958908, lng: -91.657118, address: '25 Aossey Lane SW, Cedar Rapids, IA 52404' },
  'lancer-2': { lat: 42.005434, lng: -91.635861, address: '2801 A Avenue NE, Cedar Rapids, IA 52402' },
  'lancer': { lat: 42.005353, lng: -91.636714, address: '2800 A Avenue NE, Cedar Rapids, IA 52402' },
  '124-34th-st-dr-se-1-bedroom-1-bath': { lat: 42.012635, lng: -91.633878, address: '124 34th Street Drive SE, Cedar Rapids, IA 52403' },
  'apache-park-apartments-2-bedroom-units': { lat: 41.975035, lng: -91.708567, address: '2720 Johnson Avenue NW, Cedar Rapids, IA 52405' },
  'apache-park-apartments': { lat: 41.975035, lng: -91.708567, address: '2720 Johnson Avenue NW, Cedar Rapids, IA 52405' },
};

const featured = ['camelot-apartments', 'colonial-house', 'monarch-estate-apartments', 'lamplight-terrace', 'village-2-bedroom-1-bath-units', 'lancer'];

const yamlStr = (s) => JSON.stringify(s ?? '');

async function download(url, dest) {
  try { await fs.access(dest); return true; } catch {}
  let res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (res.status === 404 && /\.(jpe?g|png)$/i.test(url)) {
    // Some originals were deleted on the legacy site but the slider's resized copy still exists.
    res = await fetch(url.replace(/(\.\w+)$/, '-830x650$1'), { headers: { 'User-Agent': UA } });
  }
  if (!res.ok) { console.warn('  ! failed', res.status, url); return false; }
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
  return true;
}

const contentDir = path.join(root, 'src', 'content', 'properties');
await fs.mkdir(contentDir, { recursive: true });

for (const p of raw) {
  const slug = p.url.split('/property/')[1].replace(/\/$/, '');
  const [nameRaw, cityRaw] = p.head.split(' - ');
  let city = (cityRaw || '').trim();
  if (!city) city = /hiawatha/i.test(slug) ? 'Hiawatha' : 'Cedar Rapids';
  const type = (p.price.split(' - ')[1] || 'Apartment').trim();
  const num = (re) => { const m = p.meta.join(' ').match(re); return m ? Number(m[1]) : 0; };
  const beds = num(/([\d.]+)\s*Bedroom/);
  const baths = num(/([\d.]+)\s*Bathroom/);
  const garage = p.meta.some((m) => /^Garage/.test(m));
  const schools = {};
  const sm = p.artText.match(/High School: (.*?)Middle School: (.*?)Elementary School: (.*?)\s*$/);
  if (sm) Object.assign(schools, { high: sm[1].trim(), middle: sm[2].trim(), elementary: sm[3].trim() });
  let name = nameRaw.trim();
  if (name === 'Village') name = `Village ${beds}-Bedroom`;
  if (slug.startsWith('apache-park-apartments')) name = `Apache Park ${beds}-Bedroom`;
  if (slug.startsWith('peartree-apartments')) name = `Peartree ${beds}-Bedroom`;

  const imgDir = path.join(root, 'src', 'assets', 'properties', slug);
  const images = [];
  for (const [i, url] of p.imgs.entries()) {
    const ext = path.extname(new URL(url).pathname).toLowerCase() || '.jpg';
    const file = `${String(i + 1).padStart(2, '0')}${ext}`;
    if (await download(url, path.join(imgDir, file))) images.push(`../../assets/properties/${slug}/${file}`);
  }

  const desc = p.contentText.replace(/\s+/g, ' ').trim();
  const g = geo[slug] || {};
  const fm = [
    '---',
    `title: ${yamlStr(name)}`,
    `city: ${yamlStr(city)}`,
    `type: ${yamlStr(type)}`,
    `beds: ${beds}`,
    `baths: ${baths}`,
    `garage: ${garage}`,
    `price: ${yamlStr('Call for Pricing')}`,
    `available: ${/Available/.test(p.price)}`,
    `featured: ${featured.includes(slug)}`,
    `summary: ${yamlStr(desc.split('. ').slice(0, 2).join('. ').replace(/\.?$/, '.'))}`,
    `features: [${p.features.map(yamlStr).join(', ')}]`,
    sm ? `schools:\n  high: ${yamlStr(schools.high)}\n  middle: ${yamlStr(schools.middle)}\n  elementary: ${yamlStr(schools.elementary)}` : null,
    g.address ? `address: ${yamlStr(g.address)}` : null,
    g.lat ? `location:\n  lat: ${g.lat}\n  lng: ${g.lng}` : null,
    `images:\n${images.map((i) => `  - ${yamlStr(i)}`).join('\n')}`,
    `legacyUrl: ${yamlStr(p.url)}`,
    '---',
    '',
    desc.split(/(?<=\.)\s+/).join('\n'),
    '',
  ].filter((l) => l !== null).join('\n');

  await fs.writeFile(path.join(contentDir, `${slug}.md`), fm);
  console.log('OK', slug, `(${images.length} images)`);
}

// Shared assets: logo, favicon, application PDFs.
const pub = path.join(root, 'public');
await download('https://www.kelleyproperty.com/wp-content/uploads/2015/02/Kelley-Logo2.png', path.join(root, 'src', 'assets', 'kelley-logo.png'));
await download('https://www.kelleyproperty.com/wp-content/uploads/2026/04/favicon-32x32-2.png', path.join(pub, 'favicon.png'));
await download('https://www.kelleyproperty.com/wp-content/uploads/2026/02/Tenant-App-UPDATE-1_05_2026.pdf', path.join(pub, 'docs', 'Kelley-Tenant-Application.pdf'));
await download('https://www.kelleyproperty.com/wp-content/uploads/2026/02/Co-Signer-Update-1_5_2026.pdf', path.join(pub, 'docs', 'Kelley-Co-Signer-Application.pdf'));
console.log('done');
