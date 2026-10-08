const fs = require('fs');
const path = require('path');

const srcDir = 'd:/Utic_2026/Area Desarrollo/front_alvieri/gasypetroquimica_2026/src';
const homeDir = path.join(srcDir, 'components', 'Home');

const filesToFix = [
  ...fs.readdirSync(homeDir).filter(f => f.endsWith('.tsx')).map(f => path.join(homeDir, f)),
  path.join(srcDir, 'hooks', 'useInteractiveEffects.ts')
];

filesToFix.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // Replace escaped backticks with real backticks
  const newContent = content.replace(/\\`/g, '`');
  if (content !== newContent) {
    fs.writeFileSync(f, newContent);
    console.log('Fixed', f);
  }
});
