# Local PDF dependencies

- pdfjs-dist 5.4.296: Mozilla PDF.js (Apache-2.0), https://github.com/mozilla/pdf.js . `pdf.mjs`, `pdf.worker.mjs`, cmaps, standard_fonts and wasm are copied from the published npm package. License retained.
- pdf-lib 1.17.1: https://github.com/Hopding/pdf-lib (MIT). `pdf-lib.min.js` and LICENSE.md copied from the npm package.

The build embeds the JavaScript into the offline page; ancillary PDF.js resources stay here for loopback HTTP mode. No runtime CDN is required. PDF parsing uses `isEvalSupported:false`. Original PDFs and reader annotations stay on the user's device; no upload service is configured.
