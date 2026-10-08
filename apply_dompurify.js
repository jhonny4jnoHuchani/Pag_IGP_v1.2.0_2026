import fs from 'fs';
import path from 'path';

const filesToFix = [
  'src/pages/EventosPage.tsx',
  'src/pages/ServiciosPage.tsx',
  'src/pages/PublicacionesPage.tsx',
  'src/pages/SeminariosPage.tsx',
  'src/pages/OfertasAcademicasPage.tsx',
  'src/components/cards/ImageCard.tsx',
  'src/components/cards/InfoBlock.tsx',
  'src/components/cards/OfertaCard.tsx',
  'src/components/cards/VideoCard.tsx'
];

const basePath = 'd:/Utic_2026/Area Desarrollo/front_alvieri/gasypetroquimica_2026';

filesToFix.forEach(relPath => {
  const fullPath = path.join(basePath, relPath);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Check if sanitizeHtml is already imported
  if (!content.includes('sanitizeHtml')) {
    // Determine relative path depth to src/utils/sanitize
    const depth = relPath.split('/').length - 1;
    let importPath = '';
    if (depth === 2) importPath = '../../utils/sanitize'; // pages/Page.tsx or components/cards/Card.tsx
    else if (depth === 3) importPath = '../../../utils/sanitize'; // fallback
    else importPath = '../utils/sanitize'; // src/Page.tsx
    
    // Inject import after first import
    content = content.replace(/(import .*?;)/, `$1\nimport { sanitizeHtml } from '${importPath}';`);
  }

  // Replace dangerouslySetInnerHTML={{ __html: VAR }} with sanitizeHtml(VAR)
  // Be careful with newlines and existing usage
  content = content.replace(
    /dangerouslySetInnerHTML=\{\{\s*__html:\s*(.+?)\s*\}\}/g,
    (match, p1) => {
      if (p1.includes('sanitizeHtml')) return match; // already sanitized
      return `dangerouslySetInnerHTML={{ __html: sanitizeHtml(${p1}) }}`;
    }
  );

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Secured ${relPath}`);
});
console.log('DOMPurify injection complete.');
