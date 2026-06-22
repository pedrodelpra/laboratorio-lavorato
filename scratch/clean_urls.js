const fs = require('fs');
const path = require('path');

const rootDir = '/Users/alinelourenconi/Documents/SAAS/SiteLaboratorioLavorato';
const htmlFiles = [
  'index.html',
  'sobre.html',
  'contato.html',
  'blog.html',
  'login.html',
  'dashboard.html'
];

htmlFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace HTML href links
  content = content.replace(/href="index\.html"/g, 'href="/"');
  content = content.replace(/href="index\.html#/g, 'href="/#');
  content = content.replace(/href="sobre\.html"/g, 'href="/sobre"');
  content = content.replace(/href="blog\.html"/g, 'href="/blog"');
  content = content.replace(/href="contato\.html"/g, 'href="/contato"');
  content = content.replace(/href="login\.html"/g, 'href="/login"');
  content = content.replace(/href="dashboard\.html"/g, 'href="/dashboard"');
  
  // Replace window.location.href redirects in Javascript
  content = content.replace(/window\.location\.href\s*=\s*'login\.html'/g, "window.location.href = '/login'");
  content = content.replace(/window\.location\.href\s*=\s*'dashboard\.html'/g, "window.location.href = '/dashboard'");
  content = content.replace(/window\.location\.href\s*=\s*'index\.html'/g, "window.location.href = '/'");
  content = content.replace(/window\.location\.href\s*=\s*"login\.html"/g, 'window.location.href = "/login"');
  content = content.replace(/window\.location\.href\s*=\s*"dashboard\.html"/g, 'window.location.href = "/dashboard"');
  content = content.replace(/window\.location\.href\s*=\s*"index\.html"/g, 'window.location.href = "/"');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned URLs in ${file}`);
});
