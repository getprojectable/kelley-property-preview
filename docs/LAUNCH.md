# Launch runbook: InMotion → GitHub Pages

The site moves from WordPress on InMotion (behind the Sucuri firewall) to GitHub Pages, with GoDaddy DNS.
**Email is Microsoft 365 and isn't affected.** Only the `@` and `www` web records change.

## 1. GitHub organization

1. Sign in with a shared Kelley mailbox (not a personal one) and create a free organization
   (e.g. `kelley-property`) at <https://github.com/organizations/plan>. Turn on 2FA.
2. Add a second Kelley owner, and invite the developer as an owner.
3. Transfer the repository: **Settings → General → Danger Zone → Transfer** to the org.
   Rename it if you like (e.g. `website`). GitHub redirects the old URL.
4. Point local clones at the new URL (Sourcetree → Repository Settings → Remotes).
5. **Org Settings → Pages → Add a domain** → `kelleyproperty.com`. Add the
   `_github-pages-challenge-<org>` TXT record it shows at GoDaddy, then click **Verify**.
6. Repo **Settings → Pages**: source **Deploy from a branch → `gh-pages` / root**. The preview is now at
   `https://<org>.github.io/<repo>/`.

## 2. Before cutover

- [ ] Web3Forms: create an access key for **info@kelleyproperty.com**, then add the repo secret `WEB3FORMS_KEY`.
- [ ] Refresh the VRBO ratings and review counts in `src/data/site.ts`.
- [ ] InMotion cPanel → **Backup**: download a full backup (files + database) and store it off the server.
- [ ] GoDaddy: export the DNS zone file so there's a record of the current settings.
- [ ] GoDaddy: lower the TTL on `@` and `www` to 600 s (do this ahead of cutover so the change has time to spread).

## 3. Cutover

1. Repo **Settings → Secrets and variables → Actions → Variables**: add `CUSTOM_DOMAIN` = `www.kelleyproperty.com`.
2. **Actions → Deploy to GitHub Pages → Run workflow** (builds production and writes `CNAME`).
3. GoDaddy DNS for `kelleyproperty.com`:

   | Type | Name | Value |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | `<org>.github.io` |

   Remove the old `@` A record (192.124.249.19, Sucuri) and any GoDaddy domain forwarding.
   **Don't touch** MX, `autodiscover`, `selector1/2._domainkey`, `mail`, SPF or the verification TXT records.
4. Repo **Settings → Pages**: confirm the custom domain shows `www.kelleyproperty.com` and the DNS check passes.
   Once the certificate is issued, tick **Enforce HTTPS**.
5. **Kelley IT:** the office's internal AD DNS (`kpm-dc01`, `kpmwin2012`) has its own `kelleyproperty.com` zone.
   Make the same `@` and `www` changes there, or office PCs will keep showing the old site.

## 4. Verify

- [ ] `http://kelleyproperty.com` and `https://kelleyproperty.com` → `https://www.kelleyproperty.com/`, with a valid certificate
- [ ] No preview banner; page source has no `noindex`; `/robots.txt` lists the sitemap
- [ ] Old URLs redirect, e.g. `/property/lancer/`, `/search-properties/`, `/contact-us/`, `/property-city/marion/`
- [ ] Each form (service request, contact, application, property inquiry) arrives at info@
- [ ] Email still sends and receives
- [ ] Checked both on the office network and off it (phone on cellular)
- [ ] Google Search Console: submit `https://www.kelleyproperty.com/sitemap-index.xml` and watch for 404s

**Rollback:** in GoDaddy (and internal DNS), restore the `@` A record to `192.124.249.19` and the `www` CNAME to
`kelleyproperty.com`, then delete the `CUSTOM_DOMAIN` variable. InMotion stays live until step 5.

## 5. Decommission InMotion

After a few weeks with no issues:

- [ ] In InMotion cPanel, confirm nothing else runs there: other domains, email accounts or forwarders, FTP, cron jobs
- [ ] Download a final backup
- [ ] Cancel InMotion and the Sucuri firewall
- [ ] Review the SPF record and remove any `include:` for services that are no longer used.
      `mail.kelleyproperty.com` (107.180.3.223) is a GoDaddy server and the SPF `ip4` is the office's Mediacom
      line, so neither depends on InMotion.
- [ ] Set the `@` and `www` TTLs back to 1 hour
