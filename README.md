# RealiSimHQ Local Sim Setup

Premium animated landing page for RealiSimHQ local home racing simulator installs around Wooster, Ohio.

## Local preview

```bash
python3 -m http.server 4173
```

Open <http://localhost:4173>.

## Booking form

This is a static site. The form currently validates and creates/copies a booking inquiry. To make it send automatically on GitHub Pages, add a booking email in `index.html` before `script.js`:

```html
<script>window.REALISIMHQ_BOOKING_EMAIL = 'you@example.com'</script>
```

For true lead capture without relying on the customer email app, connect Formspree/Tally/Google Forms or host a tiny backend on the VPS.

## Hosting options

- GitHub Pages: best for this static landing page; no VPS required.
- VPS: only needed if you want server-side booking, database, SMS, payments, admin dashboard, or CRM automation.
