// Privacy Policy & Terms of Use Modal - Dynamic Injection
(function() {
    const privacyText = `
        <h3 class="text-xl md:text-2xl font-bold text-primary mb-4">Política de Privacidade</h3>
        <p class="mb-4">No <strong>Laboratório Lavorato</strong>, a privacidade e a segurança dos dados dos nossos clientes, parceiros e cirurgiões-dentistas são fundamentais. Esta política explica como coletamos, usamos e protegemos suas informações:</p>
        
        <h4 class="font-bold text-primary mt-6 mb-2">1. Coleta de Informações</h4>
        <p class="mb-4">Coletamos informações fornecidas voluntariamente por você ao preencher nossos formulários de contato ou ao se autenticar em nossa área de parceiros, tais como nome, e-mail, telefone, nome da clínica e número de registro profissional (CRO).</p>
        
        <h4 class="font-bold text-primary mt-6 mb-2">2. Uso dos Dados</h4>
        <p class="mb-4">Os dados coletados são utilizados exclusivamente para responder a suas solicitações de contato, agendar coletas, enviar orçamentos, melhorar nossos serviços técnicos e manter a comunicação sobre o andamento dos seus casos clínicos.</p>
        
        <h4 class="font-bold text-primary mt-6 mb-2">3. Compartilhamento e Sigilo</h4>
        <p class="mb-4">O Laboratório Lavorato não vende, aluga ou compartilha suas informações pessoais com terceiros. Todos os dados relativos aos pacientes e trabalhos protéticos seguem rigorosos padrões de confidencialidade técnica e profissional.</p>
        
        <h4 class="font-bold text-primary mt-6 mb-2">4. Segurança da Informação</h4>
        <p class="mb-4">Implementamos medidas de segurança digitais e físicas para garantir a integridade dos seus dados e evitar acessos não autorizados, perdas ou alterações indevidas.</p>
        
        <h4 class="font-bold text-primary mt-6 mb-2">5. Direitos do Usuário (LGPD)</h4>
        <p class="mb-4">Você tem o direito de solicitar o acesso, retificação ou exclusão definitiva de suas informações pessoais da nossa base de dados a qualquer momento, bastando entrar em contato através dos nossos canais oficiais de atendimento.</p>
        
        <p class="mt-8 text-xs text-secondary border-t border-outline-variant/20 pt-4">Última atualização: Junho de 2026.</p>
    `;

    const termsText = `
        <h3 class="text-xl md:text-2xl font-bold text-primary mb-4">Termos de Uso</h3>
        <p class="mb-4">Ao utilizar o site e os serviços digitais do <strong>Laboratório Lavorato</strong>, você concorda em cumprir estes termos de uso:</p>
        
        <h4 class="font-bold text-primary mt-6 mb-2">1. Aceitação das Condições</h4>
        <p class="mb-4">Estes termos regem o acesso às informações e funcionalidades do site. Ao continuar a navegação ou preencher nossos formulários, você aceita integralmente as regras descritas aqui.</p>
        
        <h4 class="font-bold text-primary mt-6 mb-2">2. Propriedade Intelectual</h4>
        <p class="mb-4">Todo o conteúdo visual, marcas, logotipos, textos, layouts e materiais explicativos presentes neste site são de propriedade intelectual do Laboratório Lavorato e estão protegidos pelas leis federais brasileiras de direitos autorais.</p>
        
        <h4 class="font-bold text-primary mt-6 mb-2">3. Uso Permitido e Conduta</h4>
        <p class="mb-4">Você se compromete a usar as informações apresentadas no site apenas para fins legítimos de consulta, contato e acompanhamento de serviços protéticos. É estritamente proibida qualquer tentativa de violação de segurança do portal ou uso indevido de nossos canais.</p>
        
        <h4 class="font-bold text-primary mt-6 mb-2">4. Isenção de Responsabilidade</h4>
        <p class="mb-4">O Laboratório Lavorato trabalha continuamente para manter este portal atualizado e seguro, mas não se responsabiliza por eventuais instabilidades técnicas temporárias de provedores externos. As especificações técnicas dos trabalhos de reabilitação e prazos logísticos devem ser confirmadas formalmente com nossa central de atendimento para cada caso clínico.</p>
        
        <h4 class="font-bold text-primary mt-6 mb-2">5. Atualizações dos Termos</h4>
        <p class="mb-4">Estes termos podem ser atualizados periodicamente para refletir mudanças regulatórias ou operacionais do laboratório. Recomendamos a leitura sempre que utilizar nossos serviços digitais.</p>
        
        <p class="mt-8 text-xs text-secondary border-t border-outline-variant/20 pt-4">Última atualização: Junho de 2026.</p>
    `;

    // Create modal elements in DOM
    const modalHTML = `
        <div id="legal-modal" class="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-primary/20 backdrop-blur-md opacity-0 pointer-events-none transition-all duration-300">
            <div class="bg-white/95 backdrop-blur-lg border border-outline-variant/30 max-w-2xl w-full p-6 md:p-8 rounded-[24px] shadow-2xl transform scale-95 transition-all duration-300 flex flex-col max-h-[85vh]">
                <div class="flex justify-between items-center pb-4 border-b border-outline-variant/20 mb-6 shrink-0">
                    <img src="assets/images/Logo.avif" alt="Laboratório Lavorato" class="h-8 w-auto object-contain"/>
                    <button id="close-legal-btn" class="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant/60 text-primary hover:bg-primary/5 transition-colors" aria-label="Fechar modal">
                        <span class="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>
                <div id="legal-modal-body" class="overflow-y-auto pr-2 text-sm text-on-surface-variant leading-relaxed font-body-md select-text">
                    <!-- Content will be injected dynamically -->
                </div>
                <div class="pt-4 border-t border-outline-variant/20 mt-6 flex justify-end shrink-0">
                    <button id="close-legal-bottom-btn" class="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-md text-label-md hover:bg-opacity-95 active:scale-95 transition-all uppercase tracking-wider font-semibold">
                        Fechar Janela
                    </button>
                </div>
            </div>
        </div>
    `;

    // Append to body
    const container = document.createElement('div');
    container.innerHTML = modalHTML;
    document.body.appendChild(container.firstElementChild);

    const modal = document.getElementById('legal-modal');
    const modalContent = modal.querySelector('.transform');
    const modalBody = document.getElementById('legal-modal-body');
    const closeBtn = document.getElementById('close-legal-btn');
    const closeBottomBtn = document.getElementById('close-legal-bottom-btn');

    function openLegalModal(type) {
        modalBody.innerHTML = type === 'privacy' ? privacyText : termsText;
        modal.classList.remove('pointer-events-none', 'opacity-0');
        modal.classList.add('opacity-100');
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
        document.body.style.overflow = 'hidden';
    }

    function closeLegalModal() {
        modal.classList.add('pointer-events-none', 'opacity-0');
        modal.classList.remove('opacity-100');
        modalContent.classList.add('scale-95');
        modalContent.classList.remove('scale-100');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeLegalModal);
    closeBottomBtn.addEventListener('click', closeLegalModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeLegalModal();
        }
    });

    // Helper to bind events to triggers
    function bindTriggers() {
        const privacyBtns = document.querySelectorAll('.privacy-trigger');
        const termsBtns = document.querySelectorAll('.terms-trigger');

        privacyBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                openLegalModal('privacy');
            });
            // Update cursor style
            btn.style.cursor = 'pointer';
        });

        termsBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                openLegalModal('terms');
            });
            // Update cursor style
            btn.style.cursor = 'pointer';
        });
    }

    // Run binding
    bindTriggers();
})();
