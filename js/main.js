document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('zeekr-theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('zeekr-theme', newTheme);
    });

    const menuButton = document.getElementById('menuButton');
    const navbar = document.getElementById('navbar');
    const navLinks = navbar.querySelectorAll('a');

    menuButton.addEventListener('click', () => {
        menuButton.classList.toggle('active');
        navbar.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuButton.classList.remove('active');
            navbar.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && !menuButton.contains(e.target)) {
            menuButton.classList.remove('active');
            navbar.classList.remove('active');
        }
    });

    const colorOptions = document.querySelectorAll('.color-option');
    const mainCarImage = document.getElementById('mainCarImage');
    const colorName = document.getElementById('colorName');
    const colorDescription = document.getElementById('colorDescription');

    colorOptions.forEach(option => {
        const preload = new Image();
        preload.src = option.dataset.image;

        option.addEventListener('click', () => {
            colorOptions.forEach(btn => btn.classList.remove('active'));
            option.classList.add('active');

            mainCarImage.style.opacity = '0.25';
            setTimeout(() => {
                mainCarImage.src = option.dataset.image;
                mainCarImage.alt = `ZEEKR 9X ${option.dataset.name}`;
                colorName.textContent = option.dataset.name;
                colorDescription.textContent = option.dataset.description;
                mainCarImage.style.opacity = '1';
            }, 140);
        });
    });

    const totalFrames = 36;
    const baseImages = [
        './images/ochkulrang.jpg',
        './images/seriy.jpg',
        './images/black.jpg',
        './images/red.jpg',
        './images/white.jpg'
    ];

    baseImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    let currentFrame = 0;
    let isDragging = false;
    let startX = 0;

    const car360 = document.getElementById('car360');
    const car360Image = document.getElementById('car360Image');
    const frameNumber = document.getElementById('frameNumber');
    const rotateLeft = document.getElementById('rotateLeft');
    const rotateRight = document.getElementById('rotateRight');

    function updateFrame(index) {
        currentFrame = ((index % totalFrames) + totalFrames) % totalFrames;

        const imgIndex = Math.floor((currentFrame / totalFrames) * baseImages.length);
        const angle = (currentFrame / totalFrames) * 360;
        const rad = (angle * Math.PI) / 180;
        const scaleX = Math.cos(rad) >= 0 ? 1 : -1;
        const tiltY = Math.sin(rad) * 14;
        const zoom = 1 + Math.abs(Math.sin(rad)) * 0.04;

        car360Image.src = baseImages[imgIndex];
        car360Image.style.transform = `perspective(1000px) rotateY(${tiltY}deg) scaleX(${scaleX}) scale(${zoom})`;

        const formattedCurrent = String(currentFrame + 1).padStart(2, '0');
        const formattedTotal = String(totalFrames).padStart(2, '0');
        frameNumber.textContent = `${formattedCurrent} / ${formattedTotal}`;
    }

    updateFrame(0);

    rotateLeft.addEventListener('click', () => updateFrame(currentFrame - 1));
    rotateRight.addEventListener('click', () => updateFrame(currentFrame + 1));

    car360.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    car360.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const diff = e.clientX - startX;
        if (Math.abs(diff) >= 12) {
            const steps = Math.trunc(diff / 12);
            updateFrame(currentFrame + steps);
            startX = e.clientX;
        }
    });

    car360.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    car360.addEventListener('touchmove', (e) => {
        const diff = e.touches[0].clientX - startX;
        if (Math.abs(diff) >= 12) {
            const steps = Math.trunc(diff / 12);
            updateFrame(currentFrame + steps);
            startX = e.touches[0].clientX;
        }
    }, { passive: true });

    const languageSelect = document.getElementById('languageSelect');

    const translations = {
        uz: {
            nav: ['Bosh sahifa', 'Ranglar', '360° View', 'Salon', 'Texnologiya', 'Xususiyatlar', 'Bog‘lanish'],
            contactBtn: 'Bog‘lanish',
            heroDesc: 'Kelajak texnologiyasi, mukammal qulaylik va kuchli dizayn bir avtomobilda.',
            heroBtn1: 'Avtomobilni ko‘rish',
            heroBtn2: 'Batafsil ma’lumot',
            dragInfo: 'Aylantirish uchun suring',
            prev: 'OLDINGI',
            next: 'KEYINGI',
            formBtn: 'So‘rov yuborish'
        },
        ru: {
            nav: ['Главная', 'Цвета', 'Обзор 360°', 'Салон', 'Технологии', 'Характеристики', 'Связаться'],
            contactBtn: 'Связаться',
            heroDesc: 'Технологии будущего, безупречный комфорт и мощный дизайн в одном автомобиле.',
            heroBtn1: 'Смотреть авто',
            heroBtn2: 'Подробнее',
            dragInfo: 'Потяните для вращения',
            prev: 'НАЗАД',
            next: 'ВПЕРЁД',
            formBtn: 'Отправить заявку'
        },
        en: {
            nav: ['Home', 'Colors', '360° View', 'Interior', 'Technology', 'Specs', 'Contact'],
            contactBtn: 'Contact Us',
            heroDesc: 'Future technology, ultimate comfort, and bold design in one vehicle.',
            heroBtn1: 'Explore Car',
            heroBtn2: 'Learn More',
            dragInfo: 'Drag to rotate',
            prev: 'PREV',
            next: 'NEXT',
            formBtn: 'Send Request'
        }
    };

    languageSelect.addEventListener('change', (e) => {
        const lang = e.target.value;
        const t = translations[lang];
        if (!t) return;

        navLinks.forEach((link, idx) => {
            if (t.nav[idx]) link.textContent = t.nav[idx];
        });

        document.querySelector('.header-button').textContent = t.contactBtn;
        document.querySelector('.hero-text p').textContent = t.heroDesc;
        document.querySelector('.primary-button').textContent = t.heroBtn1;
        document.querySelector('.secondary-button').textContent = t.heroBtn2;
        document.getElementById('dragInfo').textContent = t.dragInfo;
        rotateLeft.textContent = t.prev;
        rotateRight.textContent = t.next;
        document.querySelector('#contactForm button').textContent = t.formBtn;
    });

    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('fullName').value.trim();
        formMessage.textContent = `Rahmat, ${name}! So‘rovingiz muvaffaqiyatli qabul qilindi.`;
        contactForm.reset();
    });
});