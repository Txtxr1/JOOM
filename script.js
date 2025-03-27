document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a');
    const pages = document.querySelectorAll('.page');
    const actionButtons = document.querySelectorAll('.action-button');
    const placeholders = document.querySelectorAll('.placeholder');
    const body = document.body;
    let currentTheme = localStorage.getItem('theme') || 'light';
    let sessionStartTime = localStorage.getItem('sessionStartTime') || Date.now(); // Получаем время старта сессии
    localStorage.setItem('sessionStartTime', sessionStartTime); // Обновляем время старта сессии

    // Функция для переключения темы
    function setTheme(theme) {
        currentTheme = theme;
        localStorage.setItem('theme', theme);

        if (theme === 'dark') {
            body.style.backgroundColor = '#000';
            body.style.color = '#fff';
            document.documentElement.style.setProperty('--text-color', '#fff');
            document.documentElement.style.setProperty('--background-color', '#000');
            document.documentElement.style.setProperty('--header-bg', '#111');
            document.documentElement.style.setProperty('--button-color', '#fff');
            document.documentElement.style.setProperty('--button-bg', '#000');
            themeToggle.innerHTML = '<span class="theme-icon">☀️</span>';

        } else {
            body.style.backgroundColor = '#fff';
            body.style.color = '#000';
            document.documentElement.style.setProperty('--text-color', '#000');
            document.documentElement.style.setProperty('--background-color', '#fff');
            document.documentElement.style.setProperty('--header-bg', '#f0f0f0');
            document.documentElement.style.setProperty('--button-color', '#000');
            document.documentElement.setProperty('--button-bg', '#ccc');
            themeToggle.innerHTML = '<span class="theme-icon">🌙</span>';
        }
    }

    // Инициализация темы при загрузке страницы
    setTheme(currentTheme);

    // Кнопка переключения темы
    const themeToggle = document.createElement('button');
    themeToggle.classList.add('theme-toggle-button');
    document.querySelector('header').appendChild(themeToggle);
    themeToggle.innerHTML = '<span class="theme-icon">🌙</span>';

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
    const allLinks = document.querySelectorAll('a, .action-button');
    allLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });

    // Реализация перетаскивания элементов (только для элементов с классом destination)
    let draggedElement = null;

    document.addEventListener('dragstart', function(e) {
        // Проверяем, является ли элемент, который мы пытаемся перетащить, элементом с классом 'destination'
        if (e.target.classList.contains('destination')) {
            draggedElement = e.target;
            e.dataTransfer.effectAllowed = 'move'; // Указываем, что элемент можно перемещать
            draggedElement.classList.add('dragging'); // Добавляем класс для стилизации
        } else {
            e.preventDefault(); // Отменяем перетаскивание, если это не .destination
        }
    });

    document.addEventListener('dragend', function(e) {
        if (draggedElement) {
            draggedElement.classList.remove('dragging'); // Убираем класс после перетаскивания
            draggedElement = null; // Сбрасываем draggedElement
        }
    });

    document.addEventListener('dragover', function(e) {
        e.preventDefault(); // Разрешаем drop
    });

    document.addEventListener('drop', function(e) {
        e.preventDefault();
        if (draggedElement && e.target !== draggedElement) {
            // Проверяем, чтобы дроп происходил только на элементы с классом 'page'
            const target = e.target.closest('.page');
            if (target) {
                // Определяем, куда вставить перетаскиваемый элемент
                const insertBefore = e.target.closest('.destination'); // Пытаемся найти ближайший .destination
                if (insertBefore) {
                    target.insertBefore(draggedElement, insertBefore); // Вставляем перед найденным .destination
                } else {
                    target.appendChild(draggedElement); // Если .destination не найден, добавляем в конец .page
                }
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

    showPage('home');

    animatePlaceholders();

    // Анимация появления контента (с использованием Intersection Observer)
    const contentSections = document.querySelectorAll('section, .destination, table, p, h1');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('content-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    contentSections.forEach(section => {
        observer.observe(section);
    });

    const logoLink = document.querySelector('.logo a');
    if (logoLink) {
        logoLink.addEventListener('mouseover', () => {
            logoLink.textContent = "Adventures in the Mountains!";
        });
        logoLink.addEventListener('mouseout', () => {
            logoLink.textContent = "Mountain Adventures";
        });
    }

    //  Сохранение позиции скролла
    const scrollPositions = {};

    // Функция для сохранения позиции прокрутки
    function saveScrollPosition(pageId) {
        scrollPositions[pageId] = document.documentElement.scrollTop || document.body.scrollTop;
    }

    // Функция для восстановления позиции прокрутки
    function restoreScrollPosition(pageId) {
        if (scrollPositions[pageId]) {
            document.documentElement.scrollTop = scrollPositions[pageId];
            document.body.scrollTop = scrollPositions[pageId];
        }
    }

    // Переопределяем функцию showPage для сохранения и восстановления скролла
    function showPage(pageId) {
        // Сохраняем позицию прокрутки текущей активной страницы
        const currentPage = document.querySelector('.page.active');
        if (currentPage) {
            saveScrollPosition(currentPage.id);
        }

        pages.forEach(page => page.classList.remove('active'));
        const newActive = document.getElementById(pageId);
        newActive.style.display = 'block';
        newActive.classList.add('active');
        history.pushState(null, null, '#' + pageId);

        // Восстанавливаем позицию прокрутки для новой страницы
        restoreScrollPosition(pageId);
    }

    // Перед выгрузкой страницы сохраняем позицию прокрутки
    window.addEventListener('beforeunload', () => {
        const currentPage = document.querySelector('.page.active');
        if (currentPage) {
            saveScrollPosition(currentPage.id);
        }
    });
    // Добавляем поддержку клавиатурной навигации
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            const navArray = Array.from(navLinks);
            const currentIndex = navArray.findIndex(link => link.href === window.location.href);
            let nextIndex;

            if (event.key === 'ArrowRight') {
                nextIndex = (currentIndex + 1) % navArray.length;
            } else {
                nextIndex = (currentIndex - 1 + navArray.length) % navArray.length;
            }

            navArray[nextIndex].click(); // Эмулируем клик по ссылке
        }
    });

    // Функция для воспроизведения звука при наведении
    function playSound(soundFile) {
        const audio = new Audio(soundFile);
        audio.volume = 0.3; // Установите громкость (от 0 до 1)
        audio.play();
    }

    // Добавляем звук при наведении на навигационные ссылки
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            playSound('sound/nav_hover.mp3'); // Замените 'path/to/nav_hover.mp3' на путь к вашему звуковому файлу
        });
    });
    // Добавляем уведомления
    function showNotification(message, duration = 3000) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;

        document.body.appendChild(notification);

        // Анимация появления
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Автоматическое скрытие уведомления
        setTimeout(() => {
            notification.classList.remove('show');
            // Удаляем элемент из DOM после завершения анимации
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500); // Время должно совпадать с длительностью анимации в CSS
        }, duration);
    }
    // Функция для отслеживания времени на сайте
    function startSessionTimer() {
        let startTime = localStorage.getItem('startTime');
        if (!startTime) {
            startTime = Date.now();
            localStorage.setItem('startTime', startTime);
        }

        setInterval(updateSessionTime, 1000); // Обновляем каждую секунду
    }

    function updateSessionTime() {
        let startTime = localStorage.getItem('startTime');
        let elapsedTime = Date.now() - startTime;

        let seconds = Math.floor((elapsedTime / 1000) % 60);
        let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
        let hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);

        let timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('sessionTime').textContent = `Время на сайте: ${timeString}`;
    }

    // Добавляем элемент для отображения времени на сайте
    const sessionTimeElement = document.createElement('div');
    sessionTimeElement.id = 'sessionTime';
    document.querySelector('footer').appendChild(sessionTimeElement);
    // Добавляем уведомление о посещении страницы
    window.addEventListener('load', function() {
        showNotification('Добро пожаловать на Mountain Adventures!');
        startSessionTimer()
    });
     // Функция для показа статистики посещений
    function showVisitStats() {
        let visitCount = localStorage.getItem('visitCount') || 0;
        visitCount++;
        localStorage.setItem('visitCount', visitCount);

        // Отображаем уведомление с количеством посещений
        showNotification(`Вы посетили этот сайт ${visitCount} раз(а).`);
    }
     // Функция для запроса подтверждения перед уходом со страницы
    window.addEventListener('beforeunload', function (e) {
        e.preventDefault();
        e.returnValue = ''; // Требуется для некоторых браузеров
    });

    //  Функция для добавления Cookie
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
    // Функция для получения Cookie
    function getCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    }
    // Пример использования: Устанавливаем Cookie при первом посещении
    if (!getCookie('visited')) {
        showNotification('Это ваш первый визит на наш сайт!', 5000); // Уведомление на 5 секунд
        setCookie('visited', 'true', 365); // Cookie действует 365 дней
    }

    showVisitStats();
});
