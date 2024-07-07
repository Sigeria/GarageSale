document.addEventListener('DOMContentLoaded', function() {
    const itemsContainer = document.getElementById('imageContainer');
    let totalItems = 0;
    let currentIndex = 0;

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
            return data || [];
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            hideLoader();
        }
    }

    function displayItems(items) {
        console.log('Displaying items...');
        // Clear existing content in container
    
        // Extract the header row
        const headers = items[0]; 
    
    
        // Map headers to indexes
        const headerIndexes = {};
        headers.forEach((header, index) => {
            headerIndexes[header.toLowerCase()] = index;
        });
    
        // Remove header row from items array
        items.shift();

        items.forEach(item => {
            const id = item[headerIndexes['id']];
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
        });

        // Display the first item initially
        const firstItem = itemsContainer.querySelector('.item');
        if (firstItem) {
            firstItem.classList.add('active');
        }

        // Update totalItems after displaying items
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

    fetchItems().then(items => {
        if (items && items.length > 0) {
            displayItems(items);
        } else {
            console.log('No items found.');
        }
    });

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

    showItem(currentIndex);

    window.addEventListener('wheel', function(event) {
        event.preventDefault();

        if (event.deltaY < 0) {
            currentIndex = Math.max(0, currentIndex - 1);
        } else {
            currentIndex = Math.min(totalItems - 1, currentIndex + 1);
        }

        showItem(currentIndex);
    }, { passive: false });
});
