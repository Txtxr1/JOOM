document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a');
    const pages = document.querySelectorAll('.page');
    const actionButtons = document.querySelectorAll('.action-button');
    const placeholders = document.querySelectorAll('.placeholder');
    const body = document.body;  // Для удобства доступа к body
    let currentTheme = localStorage.getItem('theme') || 'light'; // Получаем тему из localStorage

    // Функция для переключения темы
   // Функция для переключения темы
function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('theme', theme); // Сохраняем тему в localStorage

    if (theme === 'dark') {
        body.style.backgroundColor = '#000';
        body.style.color = '#fff';
        document.documentElement.style.setProperty('--text-color', '#fff');
        document.documentElement.style.setProperty('--background-color', '#000');
        document.documentElement.style.setProperty('--header-bg', '#111');
        document.documentElement.style.setProperty('--button-color', '#fff');
        document.documentElement.style.setProperty('--button-bg', '#000');
        themeToggle.innerHTML = '<span class="theme-icon">☀️</span>'; // Солнце для темной темы

    } else {
        body.style.backgroundColor = '#fff'; // Light
        body.style.color = '#000';
        document.documentElement.style.setProperty('--text-color', '#000');
        document.documentElement.style.setProperty('--background-color', '#fff');
        document.documentElement.style.setProperty('--header-bg', '#f0f0f0');
        document.documentElement.style.setProperty('--button-color', '#000');
        document.documentElement.style.setProperty('--button-bg', '#ccc');
        themeToggle.innerHTML = '<span class="theme-icon">🌙</span>'; // Луна для светлой темы
    }

}

    // Инициализация темы при загрузке страницы
    setTheme(currentTheme);

    // Кнопка переключения темы
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '<span class="theme-icon">🌙</span>'; // Луна по умолчанию
    themeToggle.classList.add('theme-toggle-button');
    document.querySelector('header').appendChild(themeToggle);

    themeToggle.addEventListener('click', function() {
        setTheme(currentTheme === 'light' ? 'dark' : 'light');
    });

    // Добавим немного случайности к анимации волн
    const waveAnimation = document.querySelector('.background-animation');
    if (waveAnimation) {
        waveAnimation.style.animationDuration = `${Math.random() * 20 + 20}s`;
        waveAnimation.style.backgroundSize = `${Math.random() * 100 + 100}% ${Math.random() * 100 + 100}%`;
    }

    function showPage(pageId) {
        pages.forEach(page => page.classList.remove('active'));
        const newActive = document.getElementById(pageId);
        newActive.style.display = 'block';
        newActive.classList.add('active');
        history.pushState(null, null, '#' + pageId);
    }

    function animatePlaceholders() {
        placeholders.forEach(placeholder => {
            placeholder.classList.add('appeared');
        });
    }

    // Добавляем анимацию для кнопок при наведении (для всех кнопок)
    const allLinks = document.querySelectorAll('a, .action-button'); // Выбираем все ссылки и кнопки
    allLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)'; // Увеличиваем масштаб при наведении
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)'; // Добавляем тень
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)'; // Возвращаем масштаб
            this.style.boxShadow = 'none'; // Убираем тень
        });
    });


    // Реализация перетаскивания элементов
    let draggedElement = null;

    document.addEventListener('dragstart', function(e) {
        draggedElement = e.target;
        e.dataTransfer.effectAllowed = 'move'; // Указываем, что элемент можно перемещать
    });

    document.addEventListener('dragover', function(e) {
        e.preventDefault(); // Разрешаем drop
    });

    document.addEventListener('drop', function(e) {
        e.preventDefault();
        if (draggedElement && e.target !== draggedElement) {
            const target = e.target.closest('.destination') || e.target.closest('main'); // Находим ближайший .destination или main
            if (target) {
                target.appendChild(draggedElement); // Добавляем перетаскиваемый элемент в цель
            }
        }
    });


    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const pageId = this.dataset.page;
            showPage(pageId);
        });
    });

    actionButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const pageId = this.dataset.page;
            showPage(pageId);
        });
    });

    // Показываем первую страницу по умолчанию
    showPage('home');

    animatePlaceholders();

    // Анимация появления контента (с использованием Intersection Observer)
    const contentSections = document.querySelectorAll('section, .destination, table, p, h1');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('content-visible'); // Добавляем класс для запуска анимации
                observer.unobserve(entry.target); // Прекращаем наблюдение за этим элементом
            }
        });
    }, { threshold: 0.2 }); // Порог видимости 20%

    contentSections.forEach(section => {
        observer.observe(section);
    });

    // Добавляем обработчик для изменения текста логотипа (при наведении или клике)
    const logoLink = document.querySelector('.logo a');
    if (logoLink) {
        logoLink.addEventListener('mouseover', () => {
            logoLink.textContent = "Adventures in the Mountains!";
        });
        logoLink.addEventListener('mouseout', () => {
            logoLink.textContent = "Mountain Adventures";
        });
    }
});
