import fs from 'fs';
import path from 'path';

const basePath = 'd:/Utic_2026/Area Desarrollo/front_alvieri/gasypetroquimica_2026';
const files = [
  { p: 'src/pages/EventosPage.tsx', correct: '../utils/sanitize' },
  { p: 'src/pages/ServiciosPage.tsx', correct: '../utils/sanitize' },
  { p: 'src/pages/PublicacionesPage.tsx', correct: '../utils/sanitize' },
  { p: 'src/pages/SeminariosPage.tsx', correct: '../utils/sanitize' },
  { p: 'src/pages/OfertasAcademicasPage.tsx', correct: '../utils/sanitize' },
  { p: 'src/components/cards/ImageCard.tsx', correct: '../../utils/sanitize' },
  { p: 'src/components/cards/InfoBlock.tsx', correct: '../../utils/sanitize' },
  { p: 'src/components/cards/OfertaCard.tsx', correct: '../../utils/sanitize' },
  { p: 'src/components/cards/VideoCard.tsx', correct: '../../utils/sanitize' }
];

files.forEach(f => {
  const fullPath = path.join(basePath, f.p);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(/import \{ sanitizeHtml \} from '.*?;/, `import { sanitizeHtml } from '${f.correct}';`);
    fs.writeFileSync(fullPath, content);
  }
});
console.log('Fixed imports!');
