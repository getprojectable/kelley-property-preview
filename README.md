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
- Legacy WordPress URLs (`/property/...`, `/search-properties/`, `/application/`, `/contact-us/`) redirect to their new pages

## Develop

```bash
npm install
npm run dev        # http://localhost:4321/kelley-property-preview/
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
The site is then served at `https://<owner>.github.io/<repo>/`.

The preview build includes a `noindex` meta tag and a "Design preview" banner.
Before launching on kelleyproperty.com:

- Build with `SITE_URL=https://www.kelleyproperty.com BASE_PATH=/ PUBLIC_PREVIEW_BANNER=false`.
- Remove the `robots` noindex tag in `src/layouts/Layout.astro`.

## Notes

- For listings without a street address, the map pin is approximate (placed by nearby landmarks), and the page says so.
- Map tiles come from © OpenStreetMap contributors.
