# Third party notices

The design study adapts ideas from VoltAgent/awesome-design-md (wired). Original license follows. Photography is credited separately in IMAGE_SOURCES.md.

MIT License

Copyright (c) 2026 VoltAgent

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Interview photographs

The Adolfo Braid supplement reproduces two institutional photographs from the IRD/ANSN portal, whose footer states Creative Commons Attribution-NoDerivatives 3.0 Unported. Credits: Douglas Troufa and Ana Paula Artaxo/ANSN. The downloaded files remain unmodified and are displayed in full, with attribution, source and license links. These assets are separate from the code license. See `docs/IMAGE_SOURCES.md` and `assets/interview/SOURCES.json` for provenance.

## Material Symbols

The unified Fronteira reader reuses the local Material Symbols sprite from Energia Atômica (Rounded, weight 400), originally taken from the npm package `@material-symbols/svg-400` 0.48.0. Material Symbols are designed by Google and licensed under the Apache License, Version 2.0: https://www.apache.org/licenses/LICENSE-2.0. The SVG paths are used unmodified inside `<symbol>` elements. No additional icon package or remote dependency is loaded.

## Inter variable font

Inter is Copyright (c) 2016 The Inter Project Authors, distributed under the SIL Open Font License, Version 1.1. The complete license is reproduced in `assets/fonts/LICENSE.txt`. Unmodified `InterVariable.woff2` and `InterVariable-Italic.woff2` come from the official [Inter 4.1 release](https://github.com/rsms/inter/releases/tag/v4.1), tag commit `e3a3d4c57d5ecc01453a575621882a384c1995a3`. Both files are served locally; no Google Fonts or other font CDN is required. Archive URL and individual SHA-256 hashes are recorded in `assets/fonts/SOURCES.json`.

## QR generation tool

`scripts/vendor/qrcodegen.py` is the Python QR Code generator by Project Nayuki, under the MIT License. Its complete copyright, permission and disclaimer notice is preserved at the top of that file. Source: [nayuki/QR-Code-generator](https://github.com/nayuki/QR-Code-generator), fixed commit `3c6d0b3cefb4e049dc337e82237c9644399716a8`, `python/qrcodegen.py`. It is used only by `scripts/generate-qr.py` to generate `assets/qr/site.svg`; the website serves the SVG without loading the encoder or Python. `assets/qr/barcode.svg` is an original decorative pattern and encodes no product identifier.

## Publisher identity and institutional cover photograph

The Fronteira wordmark and FR favicon were supplied by the project owner and are not covered by the software or font licenses above. The Eletronuclear cover photograph is likewise separate: its source page does not state a reuse license and institutional authorization has not been obtained. Do not label it Creative Commons or publicly licensed. The owner explicitly requested its use. Provenance and the unresolved rights status are recorded in `docs/IMAGE_SOURCES.md` and `assets/photos/angra-cover.source.json`.
