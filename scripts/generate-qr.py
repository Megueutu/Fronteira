"""Generate the static cover QR with a pinned MIT-licensed encoder.

Run: python scripts/generate-qr.py
The website only serves the generated SVG; it does not load this tool.
"""

from pathlib import Path
import hashlib
import json
import sys

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).parent / "vendor"))
from qrcodegen import QrCode


ROOT = Path(__file__).resolve().parent.parent
TARGET = "https://megueutu.github.io/Fronteira/"
BORDER = 4
qr = QrCode.encode_text(TARGET, QrCode.Ecc.QUARTILE)
size = qr.get_size()
dimension = size + BORDER * 2
modules = " ".join(
    f"M{x + BORDER},{y + BORDER}h1v1h-1z"
    for y in range(size)
    for x in range(size)
    if qr.get_module(x, y)
)
svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {dimension} {dimension}" '
    'width="164" height="164" role="img" aria-labelledby="qr-title" '
    'shape-rendering="crispEdges">\n'
    '<title id="qr-title">Abrir a revista Energia Nuclear no Brasil</title>\n'
    f'<desc>{TARGET}</desc>\n'
    f'<path fill="#fff" d="M0,0h{dimension}v{dimension}H0z"/>\n'
    f'<path fill="#102d21" d="{modules}"/>\n'
    '</svg>\n'
)
destination = ROOT / "assets" / "qr"
destination.mkdir(parents=True, exist_ok=True)
(destination / "site.svg").write_text(svg, encoding="utf-8")
(destination / "SOURCES.json").write_text(
    json.dumps(
        {
            "target": TARGET,
            "file": "site.svg",
            "encoder": "Nayuki QR Code generator, Python",
            "encoderCommit": "3c6d0b3cefb4e049dc337e82237c9644399716a8",
            "encoderSource": "https://github.com/nayuki/QR-Code-generator",
            "license": "MIT; full notice retained in scripts/vendor/qrcodegen.py",
            "generator": "python scripts/generate-qr.py",
            "version": qr.get_version(),
            "modules": size,
            "quietZoneModules": BORDER,
            "errorCorrection": "quartile or stronger, as selected by encoder",
            "sha256": hashlib.sha256(svg.encode("utf-8")).hexdigest(),
            "barcode": "barcode.svg: original decorative pattern; no encoded product identifier or fictitious digits",
        },
        ensure_ascii=False,
        indent=2,
    ) + "\n",
    encoding="utf-8",
)
print(f"Generated {destination / 'site.svg'} ({size} modules; {TARGET})")
