"""Monta o PDF da revista a partir das texturas das 24 faces (assets/textures/page-NN.jpg).
Os JPEGs entram no PDF sem recompressão. Uso: python scripts/build-pdf.py"""
import glob, os, sys
from PIL import Image

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
files = sorted(glob.glob(os.path.join(root, 'assets', 'textures', 'page-*.jpg')))
if not files:
    sys.exit('Nenhuma textura encontrada. Rode npm run render:textures primeiro.')
images = [Image.open(f).convert('RGB') for f in files]
width_pt = 595  # largura A4
dpi = images[0].width / (width_pt / 72)
output = os.path.join(root, 'assets', 'revista-energia-nuclear-no-brasil.pdf')
images[0].save(output, 'PDF', save_all=True, append_images=images[1:], resolution=dpi,
               title='Energia Nuclear no Brasil', author='Editora Fronteira', subject='Revista de reportagem')
print(f'PDF com {len(images)} páginas: {os.path.relpath(output, root)} ({os.path.getsize(output) / 1e6:.1f} MB)')
