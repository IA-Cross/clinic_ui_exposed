// One-time image pipeline: converts the client's raw material
// ("Verboonen-Odontología-material-web/", gitignored) into optimized webp
// assets committed under src/assets/ and public/.
//
// Usage: node scripts/optimize-images.mjs
//
// Folder names below are copied verbatim from disk — several contain a
// TRAILING SPACE and filenames contain spaces/diacritics, so everything is
// mapped explicitly instead of globbed.

import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MATERIAL = path.join(root, 'Verboonen-Odontología-material-web');

const SERVICES_OUT = path.join(root, 'src/assets/services');
const OFFICE_OUT = path.join(root, 'src/assets/office');
const BRAND_OUT = path.join(root, 'src/assets/brand');
const PUBLIC_OUT = path.join(root, 'public');

const SERVICE_MAP = [
  { folder: 'Crecimiento y Desarrollo ', slug: 'crecimiento-y-desarrollo', files: ['9.png', '10.png'] },
  { folder: 'Odontología General ', slug: 'odontologia-general', files: ['Diseño sin título (1).png', 'Inicio.jpg'] },
  { folder: 'Odontología Pediátrica', slug: 'odontologia-pediatrica', files: ['Hasta 2 meses (1).png', 'Inicio.png'] },
  { folder: 'Orthokinética', slug: 'orthokinetica', files: ['Diseño sin título.png', 'Diseño sin título copia.png'] },
  { folder: 'Ortodoncia', slug: 'ortodoncia', files: ['13.png', 'Diseño sin título.png'] },
  { folder: 'Ortopedia Maxilar ', slug: 'ortopedia-maxilar', files: ['Inicio.png', '71.png'] },
];

const OFFICE_FILES = ['DSC01201.JPG', 'DSC01253.JPG', 'DSC01263.JPG', 'DSC01287.JPG', 'DSC01309.JPG', 'DSC01363.JPG'];

const report = [];

async function toWebp(src, dest, { width, quality = 75 }) {
  const img = sharp(src).rotate(); // respect EXIF orientation
  const meta = await img.metadata();
  await img
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(dest);
  const { size } = await stat(dest);
  const out = await sharp(dest).metadata();
  report.push({ file: path.relative(root, dest), kb: Math.round(size / 1024), w: out.width, h: out.height });
  return { width: out.width, height: out.height, sourceWidth: meta.width };
}

await Promise.all([SERVICES_OUT, OFFICE_OUT, BRAND_OUT, PUBLIC_OUT].map((d) => mkdir(d, { recursive: true })));

const dims = {};

for (const { folder, slug, files } of SERVICE_MAP) {
  for (let i = 0; i < files.length; i++) {
    const dest = path.join(SERVICES_OUT, `${slug}-${i + 1}.webp`);
    const d = await toWebp(path.join(MATERIAL, folder, files[i]), dest, { width: 1200 });
    dims[`${slug}-${i + 1}`] = d;
  }
}

for (let i = 0; i < OFFICE_FILES.length; i++) {
  // consultorio-1 is the homepage hero → larger
  const width = i === 0 ? 1600 : 1200;
  const dest = path.join(OFFICE_OUT, `consultorio-${i + 1}.webp`);
  dims[`consultorio-${i + 1}`] = await toWebp(path.join(MATERIAL, 'Fotos Consultorio', OFFICE_FILES[i]), dest, { width, quality: 72 });
}

// Logos: keep transparency, no heavy resize (they're small already)
for (const [src, name] of [
  ['Logo-Verboonen-color.png', 'logo-color'],
  ['Logo-Verboonen-blanco.png', 'logo-blanco'],
  ['Logo-Verboonen-negro.png', 'logo-negro'],
]) {
  await toWebp(path.join(MATERIAL, src), path.join(BRAND_OUT, `${name}.webp`), { width: 600, quality: 90 });
}

// Favicon + apple-touch-icon from the color logo (square canvas, padded)
const logo = path.join(MATERIAL, 'Logo-Verboonen-color.png');
for (const [size, name] of [[64, 'favicon.png'], [180, 'apple-touch-icon.png']]) {
  await sharp(logo)
    .resize({ width: size - 8, height: size - 8, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .extend({ top: 4, bottom: 4, left: 4, right: 4, background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(PUBLIC_OUT, name));
}

// Default OG image (1200x630 crop of the hero office photo, jpg for scraper compatibility)
await sharp(path.join(MATERIAL, 'Fotos Consultorio', OFFICE_FILES[0]))
  .rotate()
  .resize(1200, 630, { fit: 'cover' })
  .jpeg({ quality: 78 })
  .toFile(path.join(PUBLIC_OUT, 'og-default.jpg'));

console.table(report);
const oversize = report.filter((r) => r.kb > 160 && !r.file.endsWith('og-default.jpg'));
if (oversize.length) {
  console.warn('\n⚠ Over 160KB:', oversize.map((r) => `${r.file} (${r.kb}KB)`).join(', '));
} else {
  console.log('\n✓ All web assets within size targets.');
}
console.log('\nDimensions for components:\n', JSON.stringify(dims, null, 2));
