const fs = require('fs');

const dashboardPath = '/Users/alinelourenconi/Documents/SAAS/SiteLaboratorioLavorato/dashboard.html';
let html = fs.readFileSync(dashboardPath, 'utf8');

const commentKeyword = 'Gallery Presets Data (expanded to 200+';
const syncKeyword = 'window.syncGallerySelection = function() {';

const startMatchIndex = html.indexOf(commentKeyword);
const endMatchIndex = html.indexOf(syncKeyword);

if (startMatchIndex === -1 || endMatchIndex === -1) {
    console.error("Markers not found!");
    process.exit(1);
}

const startIdx = html.lastIndexOf('//', startMatchIndex);
const endIdx = html.indexOf('};', endMatchIndex) + 2; // include the closing brace

const before = html.substring(0, startIdx);
const after = html.substring(endIdx);

const replacementJS = `// Dynamic Local Gallery Presets Management
        function getGalleryPresets() {
            try {
                let presets = localStorage.getItem('dentalab_gallery_presets');
                if (!presets) {
                    presets = '[]';
                    localStorage.setItem('dentalab_gallery_presets', presets);
                }
                return JSON.parse(presets);
            } catch (e) {
                console.error("Erro ao ler gallery presets:", e);
                return [];
            }
        }

        function saveGalleryPresets(presets) {
            try {
                localStorage.setItem('dentalab_gallery_presets', JSON.stringify(presets));
            } catch (e) {
                console.error("Erro ao salvar gallery presets:", e);
            }
        }

        function renderGalleryPresets() {
            const container = document.getElementById('image-gallery-presets');
            if (!container) return;
            
            const currentValue = document.getElementById('cms-image').value.trim();
            const presets = getGalleryPresets();
            
            if (presets.length === 0) {
                container.className = "col-span-full py-8 text-center text-xs text-slate-400 font-medium";
                container.innerHTML = \`
                    <div class="flex flex-col items-center justify-center py-4">
                        <span class="material-symbols-outlined text-[32px] text-slate-300 mb-2">image_search</span>
                        <p class="text-slate-400">Galeria vazia. Cole links no editor e marque "Salvar esta imagem" ou use "Adicionar em Lote"!</p>
                    </div>
                \`;
                return;
            }
            
            container.className = "grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-1";
            container.innerHTML = presets.map((preset, index) => {
                const isActive = currentValue === preset.url;
                const activeClasses = isActive 
                    ? 'border-2 border-primary ring-2 ring-primary/20 scale-[0.98]' 
                    : 'border border-slate-200 opacity-80 hover:opacity-100';
                
                return \`
                    <div class="relative group aspect-video rounded-xl overflow-hidden shadow-sm transition-all duration-200 \${activeClasses}" title="\${preset.name}">
                        <img onclick="selectGalleryPreset('\${preset.url}', '\${preset.alt.replace(/'/g, "\\\\'")}')" src="\${preset.url}" alt="\${preset.name}" class="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105" />
                        <div class="absolute inset-x-0 bottom-0 bg-primary/75 backdrop-blur-[2px] py-1 px-2 text-center pointer-events-none">
                            <span class="text-[9px] font-bold text-white tracking-wide">\${preset.name}</span>
                        </div>
                        \${isActive ? \`
                            <div class="absolute top-1 right-1 bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center shadow-md pointer-events-none">
                                <span class="material-symbols-outlined text-[10px] font-bold">check</span>
                            </div>
                        \` : ''}
                        <button type="button" onclick="deleteGalleryPreset(\${index})" class="absolute top-1 left-1 bg-red-500 hover:bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center shadow-md transition-colors opacity-0 group-hover:opacity-100" title="Remover da Galeria">
                            <span class="material-symbols-outlined text-[10px] font-bold">close</span>
                        </button>
                    </div>
                \`;
            }).join('');
        }

        window.selectGalleryPreset = function(url, altText) {
            document.getElementById('cms-image').value = url;
            document.getElementById('cms-image-alt').value = altText;
            renderGalleryPresets();
            showToast("Imagem da galeria selecionada!");
        };

        window.syncGallerySelection = function() {
            renderGalleryPresets();
        };

        // Bulk Import toggle & processing
        window.toggleBulkImportForm = function() {
            const form = document.getElementById('bulk-import-form');
            form.classList.toggle('hidden');
            if (!form.classList.contains('hidden')) {
                document.getElementById('bulk-urls-input').focus();
            }
        };

        window.clearGalleryDatabase = function() {
            if (confirm("Tem certeza de que deseja limpar todas as imagens da galeria de presets?")) {
                saveGalleryPresets([]);
                renderGalleryPresets();
                showToast("Galeria de presets limpa!");
            }
        };

        window.processBulkImport = function() {
            const textarea = document.getElementById('bulk-urls-input');
            const urlsText = textarea.value.trim();
            if (!urlsText) {
                alert("Por favor, insira pelo menos um link de imagem.");
                return;
            }

            const urls = urlsText.split('\\n').map(u => u.trim()).filter(u => u.startsWith('http'));
            if (urls.length === 0) {
                alert("Nenhum link válido (iniciando com http/https) encontrado.");
                return;
            }

            const presets = getGalleryPresets();
            let addedCount = 0;

            urls.forEach(url => {
                if (!presets.some(p => p.url === url)) {
                    let name = "Imagem importada";
                    try {
                        const parsed = new URL(url);
                        if (parsed.hostname.includes('unsplash.com')) {
                            const idMatch = parsed.pathname.match(/photo-([a-zA-Z0-9-]+)/);
                            name = idMatch ? \`Unsplash ID: \${idMatch[1].substring(0, 8)}\` : "Unsplash Import";
                        } else if (parsed.hostname.includes('pexels.com')) {
                            const idMatch = parsed.pathname.match(/photos\\/([0-9]+)/);
                            name = idMatch ? \`Pexels ID: \${idMatch[1]}\` : "Pexels Import";
                        } else {
                            name = parsed.hostname.replace('www.', '').split('.')[0];
                            name = name.charAt(0).toUpperCase() + name.slice(1);
                        }
                    } catch (e) {}

                    presets.push({
                        name: name,
                        url: url,
                        alt: \`Imagem importada de \${name}\`
                    });
                    addedCount++;
                }
            });

            saveGalleryPresets(presets);
            textarea.value = '';
            toggleBulkImportForm();
            renderGalleryPresets();
            showToast(\`\${addedCount} imagens importadas com sucesso!\`);
        };

        window.deleteGalleryPreset = function(index) {
            const presets = getGalleryPresets();
            presets.splice(index, 1);
            saveGalleryPresets(presets);
            renderGalleryPresets();
            showToast("Imagem removida da galeria!");
        };`;

fs.writeFileSync(dashboardPath, before + replacementJS + after, 'utf8');
console.log("Successfully made gallery presets fully dynamic!");
