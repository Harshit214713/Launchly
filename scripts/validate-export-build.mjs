import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import JSZip from 'jszip';
import { createSiteDocument, makeSection } from '../src/lib/siteDocument.ts';
import { exportSiteDocumentZip } from '../src/lib/siteZipExport.ts';

const document = createSiteDocument({
  id: 'export-check', name: 'Export Check', templateId: 'sample', theme: {},
  sections: [{ id: 'hero', name: 'Hero', type: 'hero' }],
  hero: { title: 'Welcome', description: 'A smoke test site.' }, features: [], testimonials: [],
  cta: { title: 'Start', desc: 'Now', buttonText: 'Go' },
  pages: [{ id: 'about', title: 'About', description: 'An additional page.' }],
  logoUrl: 'data:image/png;base64,aGVsbG8=',
});
document.pages[1].sections = [makeSection('faq', 'faq', 'FAQ', {}, { heading: 'Common questions', items: [{ question: 'Works?', answer: 'Yes.' }] })];

const root = process.cwd();
const temporaryRoot = await mkdtemp(path.join(root, '.launchly-export-check-'));
const safeRoot = path.resolve(temporaryRoot);
if (!safeRoot.startsWith(`${path.resolve(root)}${path.sep}`) || !path.basename(safeRoot).startsWith('.launchly-export-check-')) {
  throw new Error('Refusing to write outside the workspace temporary export directory.');
}

try {
  const archive = await exportSiteDocumentZip(document);
  const zip = await JSZip.loadAsync(new Uint8Array(await archive.arrayBuffer()));
  const projectRoot = path.join(temporaryRoot, 'export-check');
  for (const [name, entry] of Object.entries(zip.files)) {
    if (entry.dir) continue;
    const outputPath = path.resolve(temporaryRoot, name);
    if (!outputPath.startsWith(`${safeRoot}${path.sep}`)) throw new Error(`Unsafe archive path: ${name}`);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, await entry.async('nodebuffer'));
  }
  await symlink(path.join(root, 'node_modules'), path.join(projectRoot, 'node_modules'), 'junction');

  const aboutRoute = await readFile(path.join(projectRoot, 'src/app/about/page.tsx'), 'utf8');
  if (!aboutRoute.includes('about')) throw new Error('The generated About route is missing its page metadata.');
  const nextCli = path.join(root, 'node_modules/next/dist/bin/next');
  const result = spawnSync(process.execPath, [nextCli, 'build'], {
    cwd: projectRoot,
    stdio: 'inherit',
    env: { ...process.env, NODE_PATH: path.join(root, 'node_modules') },
  });
  if (result.status !== 0) process.exitCode = result.status || 1;
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
