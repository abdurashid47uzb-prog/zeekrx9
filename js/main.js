document.addEventListener('DOMContentLoaded', () => {
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

    const store = {
        get(key, fallback) {
            try { return localStorage.getItem(key) || fallback; } catch (e) { return fallback; }
        },
        set(key, value) {
            try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
        }
    };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* =========================================================
       1. THEME
    ========================================================= */
    const themeToggle = $('#themeToggle');
    const htmlElement = document.documentElement;

    htmlElement.setAttribute('data-theme', store.get('zeekr-theme', 'dark'));

    themeToggle.addEventListener('click', () => {
        const next = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', next);
        store.set('zeekr-theme', next);
    });

    /* =========================================================
       2. MOBILE MENU + SCROLL SPY
    ========================================================= */
    const menuButton = $('#menuButton');
    const navbar = $('#navbar');
    const navLinks = $$('a', navbar);

    function setMenu(open) {
        menuButton.classList.toggle('active', open);
        navbar.classList.toggle('active', open);
        menuButton.setAttribute('aria-expanded', String(open));
    }

    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.addEventListener('click', () => setMenu(!navbar.classList.contains('active')));
    navLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));

    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && !menuButton.contains(e.target)) setMenu(false);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setMenu(false);
    });

    const spyLinks = navLinks.filter(a => !a.classList.contains('mobile-contact-btn'));
    const spyMap = new Map();
    spyLinks.forEach(a => {
        const section = $(a.getAttribute('href'));
        if (section) spyMap.set(section, a);
    });

    if ('IntersectionObserver' in window) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    spyLinks.forEach(a => a.classList.remove('active'));
                    spyMap.get(entry.target)?.classList.add('active');
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        spyMap.forEach((_, section) => spy.observe(section));
    }

    /* =========================================================
       3. LANGUAGE (UZ / RU / EN)
    ========================================================= */
    const languageSelect = $('#languageSelect');

    const simpleTargets = {
        headerBtn: '.header-button',
        heroP: '.hero-text p',
        heroB1: '.primary-button',
        heroB2: '.secondary-button',
        introH2: '.intro-text h2',
        introP: '.intro-text p',
        colorsH2: '#colors .section-heading h2',
        colorsP: '#colors .section-heading p',
        viewP: '#view360 .section-heading p',
        dragInfo: '#dragInfo',
        interiorH2: '#interior .section-heading h2',
        interiorP: '#interior .section-heading p',
        interiorH3: '.interior-text h3',
        interiorText: '.interior-text p',
        techH2: '#technology .section-heading h2',
        techP: '#technology .section-heading p',
        specH2: '#specifications .section-heading h2',
        specP: '#specifications .section-heading p',
        contactH2: '.contact-text h2',
        contactP: '.contact-text p',
        formBtn: '#contactForm button',
        footerP: '.footer-content p',
        footerTop: '.footer-content a:last-child'
    };

    const listTargets = {
        nav: '#navbar a',
        interiorLi: '.interior-text li',
        techCards: '.technology-card p'
    };

    const placeholderTargets = {
        fullName: '#fullName',
        phoneNumber: '#phoneNumber',
        message: '#message'
    };

    // Asl (uz) matnlar HTML'dan avtomatik olinadi
    const original = { simple: {}, list: {}, placeholder: {} };
    Object.entries(simpleTargets).forEach(([k, s]) => { const el = $(s); if (el) original.simple[k] = el.innerHTML; });
    Object.entries(listTargets).forEach(([k, s]) => { original.list[k] = $$(s).map(el => el.innerHTML); });
    Object.entries(placeholderTargets).forEach(([k, s]) => { const el = $(s); if (el) original.placeholder[k] = el.placeholder; });

    const colorDescUz = {};
    $$('.color-option').forEach(o => { colorDescUz[o.dataset.name] = o.dataset.description; });

    const translations = {
        uz: {
            play: 'AVTO', pause: 'PAUZA',
            thanks: (n) => `Rahmat, ${n}! So‘rovingiz muvaffaqiyatli qabul qilindi.`,
            badPhone: 'Telefon raqamini to‘g‘ri kiriting.',
            alt360: 'ZEEKR 9X 360 darajali ko‘rinishi'
        },
        ru: {
            play: 'АВТО', pause: 'ПАУЗА',
            thanks: (n) => `Спасибо, ${n}! Ваша заявка успешно принята.`,
            badPhone: 'Введите корректный номер телефона.',
            alt360: 'ZEEKR 9X — обзор 360°',
            simple: {
                headerBtn: 'Связаться',
                heroP: 'Технологии будущего, безупречный комфорт и мощный дизайн в одном автомобиле.',
                heroB1: 'Смотреть авто',
                heroB2: 'Подробнее',
                introH2: 'Совершенство на <span>новом уровне</span>',
                introP: 'ZEEKR 9X — премиальный автомобиль, объединяющий современный дизайн, передовые технологии и высочайший уровень комфорта.',
                colorsH2: 'Выберите <span>свой цвет</span>',
                colorsP: 'Доступные варианты цвета кузова ZEEKR 9X.',
                viewP: 'Вращайте автомобиль мышью или пальцем.',
                dragInfo: 'Потяните для вращения',
                interiorH2: 'Комфорт в <span>каждой детали</span>',
                interiorP: 'Высокий уровень комфорта и современный дизайн салона.',
                interiorH3: 'Новое ощущение от поездки',
                interiorText: 'Просторный салон, современные материалы и удобная компоновка делают каждую поездку приятнее.',
                techH2: 'Технологии <span>будущего</span>',
                techP: 'Умные решения для каждой поездки.',
                specH2: 'Технические <span>характеристики</span>',
                specP: 'Могут отличаться в зависимости от модели и комплектации.',
                contactH2: 'Узнайте больше <span>о ZEEKR 9X</span>',
                contactP: 'Оставьте заявку, чтобы получить информацию.',
                formBtn: 'Отправить заявку',
                footerP: '© 2026 ZEEKR 9X Showcase. Неофициальная презентация.',
                footerTop: 'Наверх ↑'
            },
            list: {
                nav: ['Главная', 'Цвета', 'Обзор 360°', 'Салон', 'Технологии', 'Характеристики', 'Связаться'],
                interiorLi: ['Премиальный дизайн салона', 'Удобные сиденья', 'Современная мультимедиа', 'Просторное пространство'],
                techCards: ['Современные цифровые системы управления.', 'Технологии помощи водителю.', 'Мультимедийные и цифровые развлекательные системы.']
            },
            placeholder: { fullName: 'Имя и фамилия', phoneNumber: 'Номер телефона', message: 'Ваше сообщение' },
            colors: {
                'Ruby Red': 'Яркий и выразительный облик.',
                'Pearl White': 'Простой и элегантный дизайн.',
                'Midnight Black': 'Сильный и серьёзный характер.',
                'Silver Gray': 'Современный и универсальный стиль.',
                'Light Gray': 'Лёгкий и изящный вид.'
            }
        },
        en: {
            play: 'AUTO', pause: 'PAUSE',
            thanks: (n) => `Thank you, ${n}! Your request has been received.`,
            badPhone: 'Please enter a valid phone number.',
            alt360: 'ZEEKR 9X 360° view',
            simple: {
                headerBtn: 'Contact Us',
                heroP: 'Future technology, ultimate comfort, and bold design in one vehicle.',
                heroB1: 'Explore Car',
                heroB2: 'Learn More',
                introH2: 'Perfection at a <span>new level</span>',
                introP: 'ZEEKR 9X is a premium vehicle that combines modern design, advanced technology, and top-level comfort.',
                colorsH2: 'Choose <span>your color</span>',
                colorsP: 'Available exterior color options for the ZEEKR 9X.',
                viewP: 'Rotate the car with your mouse or finger.',
                dragInfo: 'Drag to rotate',
                interiorH2: 'Comfort in <span>every detail</span>',
                interiorP: 'High-level comfort and modern cabin design.',
                interiorH3: 'A new feeling of travel',
                interiorText: 'A spacious cabin, modern materials, and a comfortable layout make every journey more enjoyable.',
                techH2: 'Technologies of <span>the future</span>',
                techP: 'Smart solutions for every journey.',
                specH2: 'Technical <span>specifications</span>',
                specP: 'May vary depending on model and trim.',
                contactH2: 'Learn more <span>about ZEEKR 9X</span>',
                contactP: 'Leave your request to receive more information.',
                formBtn: 'Send Request',
                footerP: '© 2026 ZEEKR 9X Showcase. Unofficial showcase site.',
                footerTop: 'Back to top ↑'
            },
            list: {
                nav: ['Home', 'Colors', '360° View', 'Interior', 'Technology', 'Specs', 'Contact'],
                interiorLi: ['Premium cabin design', 'Comfortable seats', 'Modern multimedia', 'Spacious interior'],
                techCards: ['Modern digital control systems.', 'Driver-assistance technologies.', 'Multimedia and digital entertainment systems.']
            },
            placeholder: { fullName: 'Full name', phoneNumber: 'Phone number', message: 'Your message' },
            colors: {
                'Ruby Red': 'A bold and vivid look.',
                'Pearl White': 'Simple and elegant design.',
                'Midnight Black': 'Strong and serious character.',
                'Silver Gray': 'Modern and versatile style.',
                'Light Gray': 'A light and refined look.'
            }
        }
    };

    let currentLang = 'uz';
    const colorName = $('#colorName');
    const colorDescription = $('#colorDescription');
    const formMessage = $('#formMessage');

    function colorDescFor(name, fallback) {
        const t = translations[currentLang];
        return (t.colors && t.colors[name]) || colorDescUz[name] || fallback || '';
    }

    function applyLanguage(lang) {
        if (!translations[lang]) return;
        currentLang = lang;
        const t = translations[lang];

        htmlElement.setAttribute('lang', lang);
        languageSelect.value = lang;
        store.set('zeekr-lang', lang);

        Object.entries(simpleTargets).forEach(([key, selector]) => {
            const el = $(selector);
            if (!el) return;
            const value = lang === 'uz' ? original.simple[key] : t.simple[key];
            if (value !== undefined) el.innerHTML = value;
        });

        Object.entries(listTargets).forEach(([key, selector]) => {
            $$(selector).forEach((el, i) => {
                const value = lang === 'uz' ? original.list[key][i] : t.list[key][i];
                if (value !== undefined) el.innerHTML = value;
            });
        });

        Object.entries(placeholderTargets).forEach(([key, selector]) => {
            const el = $(selector);
            if (!el) return;
            el.placeholder = lang === 'uz' ? original.placeholder[key] : t.placeholder[key];
        });

        colorDescription.textContent = colorDescFor(colorName.textContent);
        formMessage.textContent = '';
        document.dispatchEvent(new CustomEvent('zeekr:lang', { detail: lang }));
    }

    languageSelect.addEventListener('change', (e) => applyLanguage(e.target.value));

    /* =========================================================
       4. COLOR PICKER
    ========================================================= */
    const colorOptions = $$('.color-option');
    const mainCarImage = $('#mainCarImage');
    let colorTimer = null;

    colorOptions.forEach(option => {
        const preload = new Image();
        preload.src = option.dataset.image;

        option.addEventListener('click', () => {
            colorOptions.forEach(btn => btn.classList.remove('active'));
            option.classList.add('active');

            clearTimeout(colorTimer);
            mainCarImage.style.opacity = '0.25';
            colorTimer = setTimeout(() => {
                mainCarImage.src = option.dataset.image;
                mainCarImage.alt = `ZEEKR 9X ${option.dataset.name}`;
                colorName.textContent = option.dataset.name;
                colorDescription.textContent = colorDescFor(option.dataset.name, option.dataset.description);
                mainCarImage.style.opacity = '1';
            }, 140);
        });
    });

    /* =========================================================
       5. 360° VIEWER
       ---------------------------------------------------------
       Haqiqiy 360 uchun ./images/360/ papkaga kadrlarni qo'ying:
         01.jpg, 02.jpg, ... 36.jpg  (bir xil o'lcham, mashina markazda)
       Kadrlar bo'lmasa — mavjud 5 ta rasm orasida silliq o'tish ishlaydi.
    ========================================================= */
    const VIEWER = {
        frameCount: 36,                       // kadrlar soni
        framePath: './images/360/',           // kadrlar papkasi
        frameName: (i) => `${String(i).padStart(2, '0')}.jpg`,
        autoSpeed: 0.08,                      // avtomatik aylanish tezligi (kadr/tick)
        dragDirection: 1,                     // aylanish teskari bo'lsa -1 qiling
        resumeDelay: 2500                     // foydalanuvchidan keyin avto qayta boshlanishi (ms)
    };

    const fallbackImages = [
        './images/ochkulrang.jpg',
        './images/seriy.jpg',
        './images/black.jpg',
        './images/red.jpg',
        './images/white.jpg'
    ];
    fallbackImages.forEach(src => { const i = new Image(); i.src = src; });

    const car360 = $('#car360');
    const imgA = $('#car360Image');
    const frameNumber = $('#frameNumber');
    const rotateLeft = $('#rotateLeft');
    const rotateRight = $('#rotateRight');

    // Stage (rasm uchun qobiq) — JS yaratadi, HTML o'zgarmaydi
    const stage = document.createElement('div');
    stage.className = 'car-360-stage';
    imgA.parentNode.insertBefore(stage, imgA);
    stage.appendChild(imgA);

    const imgB = imgA.cloneNode(false);
    imgB.removeAttribute('id');
    imgB.alt = '';
    imgB.setAttribute('aria-hidden', 'true');
    imgB.style.opacity = '0';
    stage.appendChild(imgB);

    const badge = document.createElement('div');
    badge.className = 'car-360-badge';
    badge.textContent = '360°';
    stage.appendChild(badge);

    const progress = document.createElement('div');
    progress.className = 'car-360-progress';
    progress.innerHTML = '<span></span>';
    stage.appendChild(progress);
    const progressBar = $('span', progress);

    const playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.id = 'rotatePlay';
    rotateRight.after(playBtn);

    car360.setAttribute('tabindex', '0');
    car360.setAttribute('role', 'group');
    car360.setAttribute('aria-label', 'ZEEKR 9X 360°');

    const total = VIEWER.frameCount;
    let mode = 'fallback';          // 'fallback' | 'frames'
    let frameImgs = [];
    let pos = 0;                    // float, 0 .. total
    let velocity = 0;
    let dragging = false;
    let autoplay = !reduceMotion;
    let holdUntil = 0;
    let visible = false;
    let rafId = null;
    let lastTs = 0;
    let shownFrame = -1;

    function setSrc(img, src) {
        if (img.dataset.src !== src) {
            img.dataset.src = src;
            img.src = src;
        }
    }

    const smooth = (k) => k * k * (3 - 2 * k);

    function render() {
        const f = ((pos % total) + total) % total;

        if (mode === 'frames') {
            const i = Math.round(f) % total;
            if (i !== shownFrame) {
                shownFrame = i;
                setSrc(imgA, frameImgs[i].src);
            }
            imgB.style.opacity = '0';
        } else {
            const n = fallbackImages.length;
            const t = (f / total) * n;
            const a = Math.floor(t) % n;
            const b = (a + 1) % n;
            const k = t - Math.floor(t);
            setSrc(imgA, fallbackImages[a]);
            setSrc(imgB, fallbackImages[b]);
            imgB.style.opacity = String(smooth(k));
        }

        const shown = (Math.round(f) % total) + 1;
        frameNumber.textContent = `${String(shown).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
        progressBar.style.width = `${(f / total) * 100}%`;
    }

    function tick(ts) {
        const dt = Math.min(48, ts - lastTs || 16.67) / 16.67;
        lastTs = ts;

        if (!dragging) {
            if (Math.abs(velocity) > 0.003) {
                pos += velocity * dt;
                velocity *= Math.pow(0.93, dt);
            } else {
                velocity = 0;
                if (autoplay && performance.now() > holdUntil) pos += VIEWER.autoSpeed * dt;
            }
        }

        render();
        rafId = requestAnimationFrame(tick);
    }

    function startLoop() {
        if (rafId === null) {
            lastTs = performance.now();
            rafId = requestAnimationFrame(tick);
        }
    }

    function stopLoop() {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    if ('IntersectionObserver' in window) {
        new IntersectionObserver((entries) => {
            visible = entries[0].isIntersecting;
            visible ? startLoop() : stopLoop();
        }, { threshold: 0.2 }).observe(car360);
    } else {
        visible = true;
        startLoop();
    }

    function hold() {
        holdUntil = performance.now() + VIEWER.resumeDelay;
    }

    function pxPerFrame() {
        const width = stage.getBoundingClientRect().width || 600;
        return Math.max(5, (width / total) * 1.2);
    }

    // --- Drag (sichqoncha + barmoq) ---
    let lastX = 0;
    let lastT = 0;

    stage.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        dragging = true;
        velocity = 0;
        lastX = e.clientX;
        lastT = e.timeStamp;
        try { stage.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        car360.classList.add('is-dragging');
    });

    stage.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - lastX;
        const dtMs = Math.max(1, e.timeStamp - lastT);
        const delta = (dx / pxPerFrame()) * VIEWER.dragDirection;

        pos += delta;
        const instant = delta / (dtMs / 16.67);
        velocity = velocity * 0.7 + instant * 0.3;

        lastX = e.clientX;
        lastT = e.timeStamp;
    });

    function endDrag() {
        if (!dragging) return;
        dragging = false;
        velocity = Math.max(-2.5, Math.min(2.5, velocity));
        hold();
        car360.classList.remove('is-dragging');
    }

    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    stage.addEventListener('lostpointercapture', endDrag);
    stage.addEventListener('dragstart', (e) => e.preventDefault());

    // --- Tugmalar ---
    function step(dir) {
        velocity = 0;
        pos = Math.round(pos) + dir;
        hold();
    }

    rotateLeft.addEventListener('click', () => step(-1));
    rotateRight.addEventListener('click', () => step(1));

    function updatePlayLabel() {
        const t = translations[currentLang];
        playBtn.textContent = autoplay ? t.pause : t.play;
        playBtn.setAttribute('aria-pressed', String(autoplay));
    }

    playBtn.addEventListener('click', () => {
        autoplay = !autoplay;
        holdUntil = 0;
        updatePlayLabel();
    });

    // --- Klaviatura ---
    car360.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
        else if (e.key === ' ' && e.target === car360) {
            e.preventDefault();
            playBtn.click();
        }
    });

    // --- Til o'zgarganda tugma va alt ---
    document.addEventListener('zeekr:lang', () => {
        rotateLeft.textContent = ({ uz: 'OLDINGI', ru: 'НАЗАД', en: 'PREV' })[currentLang];
        rotateRight.textContent = ({ uz: 'KEYINGI', ru: 'ВПЕРЁД', en: 'NEXT' })[currentLang];
        imgA.alt = translations[currentLang].alt360;
        updatePlayLabel();
    });

    // --- Haqiqiy kadrlarni yuklash (bo'lsa) ---
    function loadRealFrames() {
        const probe = new Image();
        probe.onload = () => {
            const list = [];
            let loaded = 0;
            let failed = false;
            for (let i = 1; i <= VIEWER.frameCount; i++) {
                const im = new Image();
                im.onload = () => {
                    loaded++;
                    if (!failed && loaded === VIEWER.frameCount) {
                        frameImgs = list;
                        mode = 'frames';
                        shownFrame = -1;
                        car360.classList.add('has-frames');
                    }
                };
                im.onerror = () => { failed = true; };
                im.src = VIEWER.framePath + VIEWER.frameName(i);
                list.push(im);
            }
        };
        probe.onerror = () => { /* kadrlar yo'q — fallback rejimi */ };
        probe.src = VIEWER.framePath + VIEWER.frameName(1);
    }

    loadRealFrames();
    updatePlayLabel();
    render();

    /* =========================================================
       6. CONTACT FORM
    ========================================================= */
    const contactForm = $('#contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const t = translations[currentLang];
        const name = $('#fullName').value.trim();
        const phone = $('#phoneNumber').value.trim();

        if (!/^[+\d\s()-]{7,}$/.test(phone)) {
            formMessage.style.color = '#ef4444';
            formMessage.textContent = t.badPhone;
            return;
        }

        formMessage.style.color = '';
        formMessage.textContent = t.thanks(name);
        contactForm.reset();
    });

    /* =========================================================
       INIT
    ========================================================= */
    applyLanguage(store.get('zeekr-lang', 'uz'));
});