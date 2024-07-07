document.addEventListener('DOMContentLoaded', function() {
    const itemsContainer = document.getElementById('imageContainer');
    let totalItems = 0;
    let currentIndex = 0;
    let headerIndexes = {}; // Объявляем здесь, чтобы была видна во всех функциях
    let slides = []; // Объявляем переменную slides

    async function fetchItems() {
        showLoader();
        console.log('Fetching items from Google Sheets...');
        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbwt3hiNq0oU2zywpaLlpy-ILCZljRw4hwTjFjEhzx_iPZkp1jZKRqXTHmd-LCU0f5t9vA/exec');
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            console.log('Data fetched from Google Sheets:', data);

            // Установка headerIndexes
            const headers = data[0];
            headers.forEach((header, index) => {
                headerIndexes[header.toLowerCase()] = index;
            });

            // Инициализация slides
            slides = data.slice(1); // Пример: используем данные без заголовков

            return slides || [];
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            hideLoader();
        }
    }

    function displayItems(items) {
        items.forEach((item, index) => {
            const name = item[headerIndexes['name']];
            const price = item[headerIndexes['price']];
            const url = item[headerIndexes['url']];

            const itemElement = document.createElement('div');
            itemElement.classList.add('item');

            const img = document.createElement('img');
            img.src = url;

            const nameElement = document.createElement('p');
            nameElement.textContent = name;
            nameElement.classList.add('item-name');

            const priceElement = document.createElement('p');
            priceElement.textContent = `${price} GEL`;
            priceElement.classList.add('item-price');

            itemElement.appendChild(img);
            itemElement.appendChild(nameElement);
            itemElement.appendChild(priceElement);
            itemsContainer.appendChild(itemElement);

            // Создание слайда для вертикального скроллинга
            const slideElement = document.createElement('div');
            slideElement.classList.add('scr');
            slideElement.textContent = name; // Используйте имя товара или другие данные для отображения
            slideElement.setAttribute('data-id', `slide${index + 1}`);
            slideElement.addEventListener('click', () => {
                currentIndex = index;
                showItem(currentIndex);
            });
            scrollPane.appendChild(slideElement);
        });

        // Установка общего количества элементов
        totalItems = items.length;
    }

    function convertToDirectLink(url) {
        // Add your logic to convert the URL to a direct link if necessary
        return url;
    }

    function showLoader() {
        const loaderContainer = document.getElementById('loaderContainer');
        loaderContainer.style.display = 'flex';
    }

    function hideLoader() {
        const loaderContainer = document.getElementById('loaderContainer');
        loaderContainer.style.display = 'none';
    }

    function showItem(index) {
        const items = document.querySelectorAll('.item');
        items.forEach((item, idx) => {
            if (idx === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    fetchItems().then(items => {
        if (items && items.length > 0) {
            displayItems(items);
        } else {
            console.log('No items found.');
        }
    });

    // Добавление инициализации скролла для вертикального скролла слайдов
    const scrollPane = document.getElementById('ScrollPane');

    // Обработка события скроллинга для переключения между слайдами
    window.addEventListener('wheel', function(event) {
        event.preventDefault();
        if (event.deltaY < 0) {
            currentIndex = Math.max(0, currentIndex - 1);
        } else {
            currentIndex = Math.min(slides.length - 1, currentIndex + 1);
        }
        showItem(currentIndex);
    }, { passive: false });
});
