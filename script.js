

async function fetchItems() {
    console.log('Fetching items from Google Sheets...');
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxz-8bb--deDLflfqyX2cH3IJZsWQ8Vh5P4is2JdrXtFgSbwzeCefrE78xo8dRXhSh2sA/exec');
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

function displayImages(items) {
    const container = document.getElementById('imageContainer');
    console.log('Displaying images...');

    items.forEach(item => {
        const url = item[1]; // Assuming the URL is in the second column (index 1)
        const img = document.createElement('img');
        const directLink = url;
        img.dataset.src = directLink; // Use data-src for lazy loading
        img.style.display = 'block'; // Ensure the image is displayed
        img.style.width = '100%';
        container.appendChild(img);
    });

    console.log('Images added to container:', container);
    lazyLoadImages();
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
            if (entry.isIntersecting) {
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
        img.style.display = 'block'; // Показываем изображение, когда оно загружено
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
                entry.target.style.display = 'none'; // Скрываем изображение, когда оно выгружено
            }
        });
    }, config);

    images.forEach(image => {
        observer.observe(image);
    });

    console.log('Unload images observer initialized.');
}

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

fetchItems().then(items => {
    if (items && items.length > 0) {
        displayImages(items);
        //unloadImages();
    } else {
        console.log('No images found in the specified range.');
    }
});
