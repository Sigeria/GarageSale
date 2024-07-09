let isPanning = false;
    let startY = 0;
    let currentY = 0;
    let threshold = 100; 

// Функция для загрузки содержимого HTML файла
function loadHTML(url, containerId) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(containerId).innerHTML = data;
        })
        .catch(error => console.error('Error loading HTML:', error));
}

// Загрузить лоадер в контейнер с id "loaderContainer"
loadHTML('loader.html', 'loaderContainer');

$(document).ready(function() {
    createEmptySlides();
    displayItems();

    // Mouse Wheel event : jQuery Mouse Wheel Plugin
    $('#ScrollPane, .scrzone').mousewheel(function(event) {
        event.preventDefault();
        if ($ScrollState == false) {
            $ScrollState = true;
            if (event.deltaY < 0) {
                UpdateScreen('+');
            } else if (event.deltaY > 0) {
                UpdateScreen('-');
            } else {
                $ScrollState = false;
            }
        }
    });

    // Touch event support with Hammer.js
    const hammer = new Hammer(document.querySelector('#ScrollPane, .scrzone'));
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
    hammer.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL, threshold: 0 });

    // Добавить обработчики для изображений внутри контейнера
    document.querySelectorAll('.pane img').forEach(img => {
        const imgHammer = new Hammer(img);
        imgHammer.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL, threshold: 0 });
        imgHammer.on('panstart', onPanStart);
        imgHammer.on('panmove', onPanMove);
        imgHammer.on('panend', onPanEnd);
    });

    hammer.on('panstart', onPanStart);
    hammer.on('panmove', onPanMove);
    hammer.on('panend', onPanEnd);
    hammer.on('swipeup', onSwipeUp);
    hammer.on('swipedown', onSwipeDown);

    function onPanStart(event) {
        isPanning = true;
        startY = window.scrollY + event.center.y;
    }

    function onPanMove(event) {
        if (isPanning) {
            currentY = startY - event.center.y;
            window.scrollTo(0, currentY);
        }
    }

    function onPanEnd(event) {
        isPanning = false;
        if ($ScrollState == false) {
            $ScrollState = true;
            let movedDistance = Math.abs(startY - (window.scrollY + event.center.y));
            if (movedDistance > threshold) {
                if (event.velocityY > 0) {
                    UpdateScreen('-');
                } else if (event.velocityY < 0) {
                    UpdateScreen('+');
                }
            } else {
                // Возвращаемся к текущему слайду
                let currentSlide = $('.pane[data-id=' + $ActualSlide + ']');
                gsap.to(window, {
                    duration: $ScrollSpeed,
                    scrollTo: { y: currentSlide.offset().top },
                    ease: "power2.out",
                    onComplete: function() {
                        $ScrollState = false;
                    }
                });
            }
        }
    }

    function onSwipeUp() {
        if ($ScrollState == false) {
            $ScrollState = true;
            UpdateScreen('+');
        }
    }

    function onSwipeDown() {
        if ($ScrollState == false) {
            $ScrollState = true;
            UpdateScreen('-');
        }
    }

    // Init function and other code remains the same


    // Init
    function Init() {
        $ScrollSpeed = 0.3; // Animation speed
        $ScrollState = false; // Scroll possible if True - If False anim already in progress
        $ActualSlide = $CibleSlide = $('.pane').first().attr('data-id'); // First slide
        $ListSlides = [];
        $('.pane').each(function() {
            $ListSlides.push($(this).attr('data-id'));
        }); // List of slides (.pane)
        gsap.to(window, { duration: 0, scrollTo: { y: 0 } });
        //$('.visible').removeClass('visible');
        //$('.pane').first().addClass('visible');
        $('#Helper').html("Init()"); // Helper
    }

    function showLoader() {
        const loaderContainer = document.getElementById('loaderContainer');
        loaderContainer.style.display = 'flex';
    }

    function hideLoader() {
        const loaderContainer = document.getElementById('loaderContainer');
        loaderContainer.style.display = 'none';
    }

    // Fetch items from Google Sheets and display them
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

    function createEmptySlides() {
        const container = document.querySelector('#ScrollPane');
        const numberOfSlides = 10; // Example number of empty slides to create
        for (let i = 0; i < numberOfSlides; i++) {
            const slide = createEmptySlide(i);
            container.appendChild(slide);
        }
    }

    function createEmptySlide(id) {
        const slide = document.createElement('div');
        slide.classList.add('pane');
        slide.setAttribute('data-id', id);
    
        const container = document.createElement('div');
        container.classList.add('ct');
    
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
        const img = document.createElement('img');
        img.alt = '';
    
        imageContainer.appendChild(img);
        container.appendChild(imageContainer);    
        
        
        const itemPrice = document.createElement('div');
        itemPrice.classList.add('item-price');

        const textContainer = document.createElement('div');
        textContainer.classList.add('text-container');
        const itemName = document.createElement('div');
        itemName.classList.add('item-name');
        
        const itemDesc = document.createElement('div');
        itemDesc.classList.add('item-description');
    
        textContainer.appendChild(itemPrice);
        textContainer.appendChild(itemName);
        textContainer.appendChild(itemDesc);
        container.appendChild(textContainer);
    
        slide.appendChild(container);
    
        return slide;
    }
    
    function setupLazyLoading() {
        const options = {
            root: null, // Use the viewport as the root
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of the slide is visible
        };
    
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const slide = entry.target;
                    const image = slide.querySelector('img');
                    if (image && image.dataset.src) {
                        image.src = image.dataset.src;
                        observer.unobserve(slide); // Stop observing once loaded
                    }
                }
            });
        }, options);
    
        document.querySelectorAll('.pane').forEach(slide => {
            observer.observe(slide);
        });
    }
    
    async function displayItems() {
        const items = await fetchItems();

        const typesSet = new Set();
        typesSet.add("Sllferlkfekr")
    
        // Extract the header row
        const headers = items[0]; 
    
        // Map headers to indexes
        const headerIndexes = {};
        headers.forEach((header, index) => {
            headerIndexes[header.toLowerCase()] = index;
        });
    
        // Remove header row from items array
        items.shift();
    
        // Fill slides with data
        const slides = document.querySelectorAll('.pane');
        items.forEach((item, index) => {
            typesSet.add(item[headerIndexes['type']]);

            const slideData = {
                id: item[headerIndexes['id']],
                name: item[headerIndexes['name']],
                description: item[headerIndexes['description']],
                price: item[headerIndexes['price']],
                url: item[headerIndexes['url']]
            };
    
            if (index < slides.length) {
                const slide = slides[index];
                const image = slide.querySelector('img');
                image.dataset.src = slideData.url;
                image.alt = slideData.name;
    
                const itemName = slide.querySelector('.item-name');
                itemName.textContent = slideData.name;

                const itemDescription = slide.querySelector('.item-description');
                itemName.textContent = slideData.description;

                const itemPrice = slide.querySelector('.item-price');
                itemPrice.textContent = `${slideData.price} GEL`;
            }
        });

        typesSet.forEach(type => {
            const button = document.createElement('button');
            button.textContent = type;
            button.addEventListener('click', () => filterItemsByType(type));
            menu.appendChild(button);
        });

        
    
        // Reinitialize the scrolling functionality
        Init();
    
        // Preload images for the initial set of slides
        preloadAdjacentImages($ActualSlide);


    }
    
    function filterItemsByType(type) {
        // Ваш код для фильтрации и отображения элементов по типу
        console.log(`Filtering items by type: ${type}`);
    }

    function preloadImage(image) {
    if (image.dataset.src && !image.src) {
        const img = new Image();
        img.src = image.dataset.src;
        img.onload = function() {
            image.src = img.src;
        };
    }
}

function preloadAdjacentImages(currentSlideId) {
    const slides = document.querySelectorAll('.pane');
    slides.forEach((slide, index) => {
        const slideId = slide.getAttribute('data-id');
        if (slideId === currentSlideId) {
            // Preload current slide image
            const currentImage = slide.querySelector('img');
            preloadImage(currentImage);

            // Preload previous slide image
            if (index > 0) {
                const prevImage = slides[index - 1].querySelector('img');
                preloadImage(prevImage);
            }

            // Preload next slide image
            if (index < slides.length - 1) {
                const nextImage = slides[index + 1].querySelector('img');
                preloadImage(nextImage);
            }
        }
    });
}

    
    
    

    // ANIMATE
    function UpdateScreen(operator) {
    $ActualSlide = $CibleSlide;
    let newIndex = $ListSlides.indexOf($ActualSlide);

    if (operator == "+") {
        newIndex += 1;
        console.log('Update scroll +');

    } else {
        newIndex -= 1;
        console.log('Update scroll -');

    }

    if (newIndex < 0 || newIndex >= $ListSlides.length) {
        $ScrollState = false;
        return;
    }

    console.log('Update scroll index', newIndex);

    $CibleSlide = $ListSlides[newIndex];
    $('#Helper').html("From <strong>" + $ActualSlide + "</strong> to <strong>" + $CibleSlide + "</strong>"); // helper
    $ActualSlideDOM = $('.pane[data-id=' + $ActualSlide + ']');
    $CibleSlideDOM = $('.pane[data-id=' + $CibleSlide + ']');
    //$ActualSlideDOM.removeClass('visible'); // Remove visible class from current slide
    // Scroll To : Greensock GSAP
    gsap.to(window, {
        duration: $ScrollSpeed,
        scrollTo: { y: $CibleSlideDOM.offset().top },
        ease: "power2.out",
        onComplete: function() {
            $ScrollState = false;
            //$CibleSlideDOM.addClass('visible'); // Add visible class to target slide
            $ActualSlide = $CibleSlide;

            // Preload images for the adjacent slides
            preloadAdjacentImages($ActualSlide);
        }
    });
}


    // Init() On Resize
    $(window).resize(function() {
        Init();
    });
});
