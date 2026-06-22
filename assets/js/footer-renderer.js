// Dynamic footer and contact info rendering for Laboratório Lavorato

const defaultFooter = {
    phone: "(11) 94793-7339",
    email: "laboratoriolavorato9@gmail.com",
    address: "R. Messina, 89 - Jardim Messina\nJundiaí - SP, 13207-480",
    tagline: "Elevando os padrões da prótese dentária com inovação tecnológica, precisão milimétrica e cuidado artesanal.",
    instagram: "https://www.instagram.com/laboratoriolavorato/",
    whatsapp: "5511947937339",
    linkedin: "https://www.linkedin.com/in/laborat%C3%B3rio-lavorato-pr%C3%B3tese-dentaria-18924258/"
};

function cleanPhoneHref(phone) {
    if (!phone) return "";
    const raw = phone.replace(/\D/g, "");
    return raw.startsWith("55") ? raw : "55" + raw;
}

function applyFooterData(data) {
    if (!data) return;

    // 1. Tagline
    const taglineEl = document.getElementById('footer-tagline');
    if (taglineEl && data.tagline) {
        taglineEl.textContent = data.tagline;
    }

    // 2. Address
    const addressEl = document.getElementById('footer-address');
    if (addressEl && data.address) {
        addressEl.innerHTML = data.address.replace(/\n/g, '<br/>');
    }

    // 3. Phone link and text
    const phoneEl = document.getElementById('footer-phone');
    if (phoneEl && data.phone) {
        const icon = phoneEl.querySelector('.material-symbols-outlined');
        phoneEl.innerHTML = '';
        if (icon) phoneEl.appendChild(icon);
        phoneEl.appendChild(document.createTextNode(' ' + data.phone));
        phoneEl.setAttribute('href', 'tel:+' + cleanPhoneHref(data.phone));
    }

    // 4. Email link and text
    const emailEl = document.getElementById('footer-email');
    if (emailEl && data.email) {
        const icon = emailEl.querySelector('.material-symbols-outlined');
        emailEl.innerHTML = '';
        if (icon) emailEl.appendChild(icon);
        emailEl.appendChild(document.createTextNode(' ' + data.email));
        emailEl.setAttribute('href', 'mailto:' + data.email);
    }

    // 5. Social links
    const instagramEl = document.getElementById('footer-instagram');
    if (instagramEl && data.instagram) {
        instagramEl.setAttribute('href', data.instagram);
    }

    const whatsappEl = document.getElementById('footer-whatsapp');
    if (whatsappEl && data.whatsapp) {
        whatsappEl.setAttribute('href', 'https://wa.me/' + cleanPhoneHref(data.whatsapp));
    }

    const linkedinEl = document.getElementById('footer-linkedin');
    if (linkedinEl && data.linkedin) {
        linkedinEl.setAttribute('href', data.linkedin);
    }

    // 6. Floating WhatsApp button
    const floatingWaEl = document.getElementById('whatsapp-floating-btn');
    if (floatingWaEl && data.whatsapp) {
        floatingWaEl.setAttribute('href', 'https://wa.me/' + cleanPhoneHref(data.whatsapp));
    }

    // 7. Contact Page Specific elements (in the body of contato.html)
    const bodyPhone = document.getElementById('body-contact-phone');
    if (bodyPhone && data.phone) {
        bodyPhone.textContent = data.phone;
        const bodyPhoneLink = bodyPhone.closest('a');
        if (bodyPhoneLink) {
            bodyPhoneLink.setAttribute('href', 'tel:+' + cleanPhoneHref(data.phone));
        }
    }

    const bodyEmail = document.getElementById('body-contact-email');
    if (bodyEmail && data.email) {
        bodyEmail.textContent = data.email;
        const bodyEmailLink = bodyEmail.closest('a');
        if (bodyEmailLink) {
            bodyEmailLink.setAttribute('href', 'mailto:' + data.email);
        }
    }

    const bodyWhatsapp = document.getElementById('body-contact-whatsapp');
    if (bodyWhatsapp && data.whatsapp) {
        bodyWhatsapp.setAttribute('href', 'https://wa.me/' + cleanPhoneHref(data.whatsapp));
        const bodyWhatsappText = document.getElementById('body-contact-whatsapp-text');
        if (bodyWhatsappText && data.phone) {
            bodyWhatsappText.textContent = data.phone;
        }
    }

    const bodyAddress = document.getElementById('body-contact-address');
    if (bodyAddress && data.address) {
        bodyAddress.innerHTML = data.address.replace(/\n/g, '<br/>');
    }

    const bodyInstagram = document.getElementById('body-contact-instagram');
    if (bodyInstagram && data.instagram) {
        bodyInstagram.setAttribute('href', data.instagram);
    }

    const bodyLinkedin = document.getElementById('body-contact-linkedin');
    if (bodyLinkedin && data.linkedin) {
        bodyLinkedin.setAttribute('href', data.linkedin);
    }
}

function initFooter() {
    let footerData = null;
    try {
        const stored = localStorage.getItem('dentalab_footer_v2');
        if (stored) {
            footerData = JSON.parse(stored);
        }
    } catch (e) {
        console.error("Error loading local cached footer:", e);
    }

    if (!footerData) {
        footerData = defaultFooter;
    }

    // Aplica o cache ou default imediatamente para não atrasar a renderização da página
    applyFooterData(footerData);

    // Busca em tempo real do Supabase
    import('./supabase-client.js')
        .then(async (module) => {
            if (module.isSupabaseConfigured() && module.supabase) {
                try {
                    const { data, error } = await module.supabase
                        .from('site_settings')
                        .select('value')
                        .eq('key', 'footer')
                        .maybeSingle();

                    if (!error && data && data.value) {
                        localStorage.setItem('dentalab_footer_v2', JSON.stringify(data.value));
                        applyFooterData(data.value);
                    }
                } catch (e) {
                    console.error("Error syncing footer from Supabase:", e);
                }
            }
        })
        .catch(err => {
            console.warn("Supabase client could not be loaded for footer sync:", err);
        });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooter);
} else {
    initFooter();
}
