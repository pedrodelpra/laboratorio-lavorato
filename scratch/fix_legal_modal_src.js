const fs = require('fs');
const path = require('path');

const rootDir = '/Users/alinelourenconi/Documents/SAAS/SiteLaboratorioLavorato';
const htmlFiles = [
  'index.html',
  'sobre.html',
  'contato.html',
  'blog.html'
];

htmlFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/src="assets\/js\/legal-modal\.js"/g, 'src="/assets/js/legal-modal.js"');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated legal-modal.js script path in ${file}`);
});
