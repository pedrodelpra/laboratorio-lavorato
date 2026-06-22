const fs = require('fs');
const path = require('path');

const files = ['index.html', 'sobre.html', 'blog.html', 'contato.html'];

for (const file of files) {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove the buttons container
    content = content.replace(/<div class="flex gap-6">\s*<button class="text-on-surface-variant hover:text-primary transition-colors text-xs md:text-sm font-medium privacy-trigger">Política de Privacidade<\/button>\s*<button class="text-on-surface-variant hover:text-primary transition-colors text-xs md:text-sm font-medium terms-trigger">Termos de Uso<\/button>\s*<\/div>/g, '');

    // Remove the script import
    content = content.replace(/<script type="module" src="\/assets\/js\/legal-modal\.js"><\/script>\n/g, '');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
