import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface MapPoint {
  id: string;
  title: string;
  lat: number;
  lng: number;
  href?: string;
  thumb?: string;
  meta?: string;
  exact?: boolean;
}

const pinSvg = (active = false) =>
  `<svg viewBox="0 0 32 42" width="32" height="42" aria-hidden="true"><path d="M16 0C7.2 0 0 7 0 15.7 0 27.5 16 42 16 42s16-14.5 16-26.3C32 7 24.8 0 16 0Z" fill="${active ? '#123a17' : '#478029'}"/><circle cx="16" cy="15.5" r="6.5" fill="#fff"/></svg>`;

export function pinIcon(active = false) {
  return L.divIcon({ html: pinSvg(active), className: 'kp-pin', iconSize: [32, 42], iconAnchor: [16, 42], popupAnchor: [0, -38] });
}

export const bounds = (pts: L.LatLngExpression[]) => L.latLngBounds(pts);

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export function createMap(el: HTMLElement, opts: { center?: [number, number]; zoom?: number; scrollZoom?: boolean } = {}) {
  const map = L.map(el, {
    center: opts.center ?? [41.995, -91.66],
    zoom: opts.zoom ?? 12,
    scrollWheelZoom: opts.scrollZoom ?? false,
    zoomControl: true,
    zoomSnap: 0.25,
  });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    className: 'kp-tiles',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  return map;
}

export function popupHtml(p: MapPoint) {
  return `<a href="${p.href ?? '#'}" class="kp-popup">
    ${p.thumb ? `<img src="${p.thumb}" alt="" loading="lazy">` : ''}
    <span class="kp-popup-body"><strong>${escapeHtml(p.title)}</strong>${p.meta ? `<span>${escapeHtml(p.meta)}</span>` : ''}
    ${p.exact === false ? '<em>Approximate area</em>' : ''}</span></a>`;
}

/** Group points sharing coordinates so stacked listings get a single pin with a combined popup. */
export function addPoints(map: L.Map, points: MapPoint[]) {
  const groups = new Map<string, MapPoint[]>();
  for (const p of points) {
    const k = `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`;
    groups.set(k, [...(groups.get(k) ?? []), p]);
  }
  const markers = new Map<string, L.Marker>();
  const layer = L.layerGroup().addTo(map);
  for (const group of groups.values()) {
    const m = L.marker([group[0].lat, group[0].lng], { icon: pinIcon(), title: group.map((g) => g.title).join(', ') });
    m.bindPopup(`<div class="kp-popup-list">${group.map(popupHtml).join('')}</div>`, { maxWidth: 280, minWidth: 240 });
    m.addTo(layer);
    group.forEach((g) => markers.set(g.id, m));
  }
  return { layer, markers };
}
