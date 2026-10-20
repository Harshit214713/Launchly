import JSZip from 'jszip';
import { generateProjectFiles, ProjectTemplateParams } from './projectFiles';

export type ExportTemplateParams = ProjectTemplateParams;

export async function exportTemplateAsZip(params: ExportTemplateParams): Promise<Blob> {
  const zip = new JSZip();
  const folderName = params.siteTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'launchly-site';
  const root = zip.folder(folderName) || zip;

  const files = generateProjectFiles(params);
  for (const [path, content] of Object.entries(files)) {
    root.file(path, content);
  }

  return await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}
