import fs from 'fs';
import path from 'path';

const dir = 'd:/Utic_2026/Area Desarrollo/front_alvieri/gasypetroquimica_2026/src/components/Home';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/\\`/g, '`');
  content = content.replace(/\\\$/g, '$');
  fs.writeFileSync(filePath, content);
}
console.log('Finished removing escaped backticks and dollars.');
