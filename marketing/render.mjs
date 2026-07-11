// marketing/svg altındaki tüm görselleri PNG olarak marketing/png'ye basar.
// Kullanım: cd marketing && npm install && npm run render

import { Resvg } from '@resvg/resvg-js';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const kaynakDizin = fileURLToPath(new URL('./svg/', import.meta.url));
const hedefDizin = fileURLToPath(new URL('./png/', import.meta.url));

await mkdir(hedefDizin, { recursive: true });

for (const dosya of await readdir(kaynakDizin)) {
  if (!dosya.endsWith('.svg')) continue;
  const svg = await readFile(path.join(kaynakDizin, dosya));
  const genislik = Number(/width="(\d+)"/.exec(svg.toString())?.[1] ?? 1200);
  const r = new Resvg(svg, {
    fitTo: { mode: 'width', value: genislik },
    font: { loadSystemFonts: true, defaultFontFamily: 'Segoe UI' },
    background: 'rgba(0,0,0,0)',
  });
  const png = r.render().asPng();
  const hedef = path.join(hedefDizin, dosya.replace('.svg', '.png'));
  await writeFile(hedef, png);
  console.log(`${dosya} -> ${path.basename(hedef)} (${Math.round(png.length / 1024)} KB)`);
}
