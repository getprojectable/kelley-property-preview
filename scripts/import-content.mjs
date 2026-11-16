// One-time import of listings from the legacy WordPress site (data captured in raw-properties.json).
// Usage: node scripts/import-content.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const raw = JSON.parse(await fs.readFile(path.join(root, 'scripts', 'raw-properties.json'), 'utf8'));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36';

// Coordinates: geocoded from street addresses where known (legacy slugs and photo file names),
// otherwise approximated from landmarks mentioned in the listing. Only pins flagged `exact` show as precise.
const geo = {
  '320-blairs-ferry-road-b-hiawatha-ia-52233': { lat: 42.0350, lng: -91.6674, address: '320 Blairs Ferry Rd, Suite B, Hiawatha, IA 52233', exact: true },
  'sierra-dr-apartments': { lat: 42.0032, lng: -91.6685, address: 'Sierra Dr NE, Cedar Rapids, IA' },
  'peartree-apartments-2': { lat: 41.9574, lng: -91.6952 },
  'peartree-apartments': { lat: 41.9574, lng: -91.6952 },
  'wedgewood-apartments': { lat: 42.0295, lng: -91.6221 },
  'oakridge-terrace': { lat: 41.9696, lng: -91.6213 },
  '6800-devonshire-dr-ne': { lat: 42.0455, lng: -91.6364, address: '6800 Devonshire Dr NE, Cedar Rapids, IA 52402', exact: true },
  'lamplight-terrace': { lat: 41.9705, lng: -91.6545 },
  'monarch-estate-apartments': { lat: 41.9504, lng: -91.6527 },
  'monarch-estates-townhouses': { lat: 41.9504, lng: -91.6527 },
  'camelot-apartments': { lat: 42.0395, lng: -91.6700 },
  'colonial-house': { lat: 42.0290, lng: -91.6150 },
  'village-2-bedroom-1-bath-units': { lat: 41.9180, lng: -91.6580 },
  'village-1-bedroom-1-bath-units': { lat: 41.9180, lng: -91.6580 },
  'lancer-2': { lat: 42.0053, lng: -91.6368, address: 'A Ave NE, Cedar Rapids, IA 52402' },
  'lancer': { lat: 42.0053, lng: -91.6368, address: '2800, 2805 & 2818 A Ave NE, Cedar Rapids, IA 52402', exact: true },
  '124-34th-st-dr-se-1-bedroom-1-bath': { lat: 42.0127, lng: -91.6338, address: '124 34th St Dr SE, Cedar Rapids, IA 52403', exact: true },
  'apache-park-apartments-2-bedroom-units': { lat: 41.9747, lng: -91.7085 },
  'apache-park-apartments': { lat: 41.9747, lng: -91.7085 },
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
    g.lat ? `location:\n  lat: ${g.lat}\n  lng: ${g.lng}\n  exact: ${!!g.exact}` : null,
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
