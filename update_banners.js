const fs = require('fs');
const path = require('path');

const pagesPath = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesPath).filter(f => f.endsWith('Page.tsx'));

files.forEach(file => {
  let content = fs.readFileSync(path.join(pagesPath, file), 'utf-8');
  
  if (content.includes('HeroBanner')) {
    // Inserta `contenido` en the destructuring de useCarreraData() si no existe
    if (!content.includes('contenido') && content.includes('useCarreraData()')) {
      content = content.replace(/(const \s*\{\s*[^}]+)(\}\s*=\s*useCarreraData\(\);)/, '$1, contenido $2');
    }
    
    // Inserta `portadas={contenido?.portada}` en HeroBanner
    if (!content.includes('portadas=')) {
       content = content.replace(/<HeroBanner([^>]+)colors=\{colors\}/, '<HeroBanner$1colors={colors} portadas={contenido?.portada}');
       content = content.replace(/<HeroBanner\s+title="([^"]+)"\s+description="([^"]+)"\s*\/>/, '<HeroBanner title="$1" description="$2" colors={colors} portadas={contenido?.portada} />');
       // En caso de que se pase descripciones u otros params pero no portadas
    }
    
    fs.writeFileSync(path.join(pagesPath, file), content, 'utf-8');
    console.log(`Updated ${file}`);
  }
});
