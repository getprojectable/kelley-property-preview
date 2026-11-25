# Kelley Properties – Website Redesign (Preview)

Modern rebuild of [kelleyproperty.com](https://www.kelleyproperty.com) using **Astro** + **Tailwind CSS**.
It's a fast static site with no database or server, and it's hosted free on GitHub Pages for customer review.

## Features

- Responsive, accessible design using the Kelley brand greens
- All 19 current listings migrated, with photos, amenities and nearby schools
- Rental search with instant filters (location, type, beds, baths, amenities) and an interactive map view
- Property pages with a photo gallery and lightbox, a location map, and an inquiry form
- Working forms: Service Request (same fields as the current site), Contact, Online Application and property inquiries
- Apply page with the existing Tenant and Co-Signer PDF applications
- About and Tropical Vacation Rentals pages
- SEO basics: per-page titles and descriptions, Open Graph tags and schema.org `RealEstateAgent`
- Legacy WordPress URLs (`/property/...`, `/search-properties/`, `/application/`, `/contact-us/`, and the
  `/property-city/`, `/property-type/`, `/property-feature/`, `/property-status/` and `/author/` archives)
  redirect to their new pages
- `sitemap-index.xml` and `robots.txt` are generated at build time

## Develop

```bash
npm install
npm run dev        # http://localhost:4321/
npm run build      # outputs dist/
npm run check      # type-check
```

Node 22+ is required.

## Editing listings

Each listing is a Markdown file in `src/content/properties/`. Photos live in `src/assets/properties/<listing>/`.
To add a listing, copy an existing `.md` file, update the frontmatter, and add its photos. Images are resized
and converted to WebP automatically at build time.

Company details (phone, hours, address, navigation, vacation rentals) are in `src/data/site.ts`.

`scripts/import-content.mjs` is the one-time import from the old WordPress site. It reads `scripts/raw-properties.json`.

## Forms

Forms post to [Web3Forms](https://web3forms.com), a free service that emails each submission.

1. Get a free access key at web3forms.com, using the email address that should receive submissions.
2. Add it as a repository secret named `WEB3FORMS_KEY`, or set `PUBLIC_WEB3FORMS_KEY` in a local `.env` file.

Without a key, forms run in **preview mode**: they validate and show a success message, but nothing is sent.

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds the site on every push to `main` and publishes it to the `gh-pages` branch.
In **Settings → Pages**, set the source to **Deploy from a branch → `gh-pages` / root**.

| Repository variable `CUSTOM_DOMAIN` | Build |
|---|---|
| not set | **Preview** at `https://<owner>.github.io/<repo>/`, with a "Design preview" banner and `noindex` |
| `www.kelleyproperty.com` | **Production** at the domain root: no banner, indexable, and a `CNAME` file is published |

`PUBLIC_PREVIEW=false` turns off the banner and `noindex` (CI sets it from `CUSTOM_DOMAIN`).
The step-by-step move from InMotion is in [docs/LAUNCH.md](docs/LAUNCH.md).

## Notes

- Street addresses and map pins come from the original listing pages. Two original pins pointed to a placeholder location, so those two were geocoded from their addresses instead.
- Vacation rental photos and details come from Kelley's own VRBO listings (`src/data/site.ts`, `src/assets/vacation/`). Ratings and review counts are a snapshot, so refresh them before launch.
- The Grande Caribe A-9 and Sunset Caribe #1–3 VRBO links on the original site no longer open a listing. Grand Caribe CH-4 used the same link as Truman Treasure. For these Belize condos the new site asks guests to call instead.
- Map tiles come from © OpenStreetMap contributors.
