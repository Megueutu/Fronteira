import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

export const textureSources = [
  'src/content.js','src/data.js','src/styles.css','src/citations.js','src/explorers.js',
  'src/editorial-cover.js','src/interview-pages.js','src/interview.js','src/pagination.js','src/icons.js',
  'assets/fonts/InterVariable.woff2','assets/fonts/InterVariable-Italic.woff2',
  'assets/branding/fronteira.svg','assets/photos/angra-cover.jpg','assets/qr/site.svg','assets/qr/barcode.svg',
];
export async function textureFingerprint() {
  const hash=createHash('sha256');
  for(const name of textureSources) {
    const source=await readFile(new URL(`../${name}`,import.meta.url));
    hash.update(name+'\n');
    hash.update(/\.(js|css|svg)$/.test(name) ? source.toString('utf8').replaceAll('\r\n','\n') : source);
  }
  return hash.digest('hex');
}
