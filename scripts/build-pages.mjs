import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.resolve(root, '_site');
const requestedBase = process.env.BASE_PATH || '/';
const base = `${requestedBase.replace(/\/+$/, '')}/`;
if (!/^\/(?:[a-z0-9_.-]+\/)*$/i.test(base) || base.split('/').some(part => part === '.' || part === '..')) {
  throw new Error('BASE_PATH must be an absolute URL path, for example /Fronteira/');
}
// Only this generated directory inside the checkout may be removed.
if (path.dirname(output) !== path.resolve(root) || path.basename(output) !== '_site') throw new Error('Unsafe output directory');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
// Explicit allowlist: never publish local documents, test artifacts or Git files.
for (const entry of ['index.html', 'src', 'assets', 'previews']) {
  await cp(path.join(root, entry), path.join(output, entry), { recursive: true });
}
async function rewrite(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await rewrite(file);
    else if (/\.(html|css|js)$/.test(entry.name)) {
      const source = await readFile(file, 'utf8');
      // Preserve relative imports and external URLs; relocate app-root resources.
      await writeFile(file, source.replace(/(["'`])\/(?=assets\/|src\/|\?)/g, `$1${base}`));
    }
  }
}
await rewrite(output);
await writeFile(path.join(output, '.nojekyll'), '');
console.log(`Static site built in _site with base path ${base}`);
