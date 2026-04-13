# Dream Nest Site

Static multi-page marketing website for Dream Nest interior design services.

## Overview

This project is a plain HTML, CSS, and JavaScript site with no build step or package manager.  
Each main page includes its own page-specific markup and inline styles, while shared behavior is handled through a common script and intro stylesheet.

## Current Pages

- `index.html` - homepage with hero, services, stats, featured work, testimonials, and CTA
- `about.html` - company story, values, process, and business highlights
- `services.html` - service listings and service-specific content
- `portfolio.html` - project showcase / gallery page
- `contact.html` - contact details and quote/contact form

## Shared Files

- `script.js` - shared frontend behavior such as:
  - intro animation lifecycle
  - current year injection
  - quote form WhatsApp submission
  - service selection from URL params
  - homepage counters and motion helpers
- `intro.css` - shared splash / intro animation styling
- `styles.css` - legacy standalone stylesheet currently present in the repository

## Assets

- `dreamnest-logo-header-dark.png`
- `dreamnest-logo-header-light.png`
- `dreamnest-logo-lockup-dark.png`
- `dreamnest-logo-lockup-light.png`
- `dreamnestlogo.PNG`
- `logo.jpeg`

## Project Structure

```text
dreamnest_site/
|-- index.html
|-- about.html
|-- services.html
|-- portfolio.html
|-- contact.html
|-- intro.css
|-- script.js
|-- styles.css
|-- dreamnest-logo-header-dark.png
|-- dreamnest-logo-header-light.png
|-- dreamnest-logo-lockup-dark.png
|-- dreamnest-logo-lockup-light.png
|-- dreamnestlogo.PNG
|-- logo.jpeg
`-- README.md
```

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Font Awesome CDN
- Google Fonts

## Running Locally

No installation is required.

1. Open `index.html` directly in a browser, or
2. Serve the folder with any static file server

Example:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Notes

- Most styling is embedded directly inside each HTML page instead of being split into separate CSS files.
- All pages load `script.js` and `intro.css`.
- The site uses a mix of local logo assets and externally hosted images/fonts/icons.
