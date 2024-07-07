async function fetchItems() {
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
    }
}

function displayItems(items) {
    const container = document.getElementById('imageContainer');
    console.log('Displaying items...');

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

        const itemContainer = document.createElement('div');
        itemContainer.classList.add('item-container');

        const img = document.createElement('img');
        const directLink = convertToDirectLink(url);
        img.dataset.src = directLink; // Use data-src for lazy loading
        img.classList.add('item-image');

        const nameElement = document.createElement('p');
        nameElement.textContent = `${name}`;
        nameElement.classList.add('item-name');

        const priceElement = document.createElement('p');
        priceElement.textContent = `${price} GEL`;
        priceElement.classList.add('item-price');

        itemContainer.appendChild(img);
        itemContainer.appendChild(nameElement);
        itemContainer.appendChild(priceElement);
        container.appendChild(itemContainer);
    });

    console.log('Items added to container:', container);
    lazyLoadImages();
}

function convertToDirectLink(url) {
    // Add your logic to convert the URL to a direct link if necessary
    return url;
}

function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const config = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    let observer = new IntersectionObserver((entries, self) => {
        entries.forEach(entry => {
            console.log('Intersection Observer entry:', entry);
            if (/*entry.isIntersecting*/true) {
                console.log('Image is in viewport, loading image:', entry.target);
                preloadImage(entry.target);
                self.unobserve(entry.target);
            } else {
                console.log('Image is not in viewport:', entry.target);
            }
        });
    }, config);

    images.forEach(image => {
        observer.observe(image);
        console.log('Observer attached to image:', image);
    });

    console.log('Lazy load images observer initialized.');
}

function preloadImage(img) {
    const src = img.dataset.src;
    if (!src) {
        return;
    }
    img.src = src;
    img.onload = () => {
        console.log('Image loaded:', img);
        img.removeAttribute('data-src');
        img.style.display = 'block'; // Show image when loaded
    };
}

function unloadImages() {
    const images = document.querySelectorAll('img');
    const config = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    let observer = new IntersectionObserver((entries, self) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                console.log('Image is out of viewport, unloading image:', entry.target);
                entry.target.src = '';
                entry.target.style.display = 'none'; // Hide image when unloaded
            }
        });
    }, config);

    images.forEach(image => {
        observer.observe(image);
    });

    console.log('Unload images observer initialized.');
}

fetchItems().then(items => {
    if (items && items.length > 0) {
        displayItems(items);
        //unloadImages();
    } else {
        console.log('No images found in the specified range.');
    }
});
