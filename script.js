$(document).ready(function() {
    Init();

    // Mouse Wheel event : jQuery Mouse Wheel Plugin
    $('.pane,.scrzone').mousewheel(function(event) {
        event.preventDefault();
        if($ScrollState == false) {
            $ScrollState = true;
            if(event.deltaY < 0) {
                UpdateScreen('+');
            } else if(event.deltaY > 0) {
                UpdateScreen('-');
            } else {
                $ScrollState = false;
            }
        }
    });

    // Touch event support
    let touchStartY = 0;
    let touchEndY = 0;

    $('.pane,.scrzone').on('touchstart', function(event) {
        touchStartY = event.changedTouches[0].screenY;
    });

    $('.pane,.scrzone').on('touchmove', function(event) {
        touchEndY = event.changedTouches[0].screenY;
    });

    $('.pane,.scrzone').on('touchend', function(event) {
        if ($ScrollState == false) {
            $ScrollState = true;
            if (touchStartY - touchEndY > 50) {
                UpdateScreen('+');
            } else if (touchEndY - touchStartY > 50) {
                UpdateScreen('-');
            } else {
                $ScrollState = false;
            }
        }
    });

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
        $('.visible').removeClass('visible');
        $('.pane').first().addClass('visible');
        $('#Helper').html("Init()"); // Helper

        // Load images
        loadImages();
    }

    // Load images into slides
    function loadImages() {
        const imageUrls = [
            "https://lh3.googleusercontent.com/drive-viewer/AKGpihYC5zalNAuEdMUmRt0QpZVkfpNESi7qES4WqvaabHOvmMon9zmHJdDMkyxBFbssYuMDN2vXR2cPvE_DiI4oqrBesXVG0cTK6w=s2560",
            "https://lh3.googleusercontent.com/drive-viewer/AKGpihZlDppPOyBHIhbuLJdDgA0fSdSWrzb72KFxytOiihRi6r-3kLBNr3iRlAb0lxrAGHvlzSUwlAHGoH_YVzHtFv0GcKtJ1-MEz5A=s2560",
            "https://lh3.googleusercontent.com/drive-viewer/AKGpiha-sWAcc-Y4NJxUHvvEiunKOruHmiFokfUfKYNVe6Vtn_ztLUf2s5HwTCT9-qxKWZQRtDlCcirB1ZtqS3bKMz_XRePk5vJc-Mc=s2560",
            "https://lh3.googleusercontent.com/drive-viewer/AKGpihYC5zalNAuEdMUmRt0QpZVkfpNESi7qES4WqvaabHOvmMon9zmHJdDMkyxBFbssYuMDN2vXR2cPvE_DiI4oqrBesXVG0cTK6w=s2560",
            "https://lh3.googleusercontent.com/drive-viewer/AKGpihZlDppPOyBHIhbuLJdDgA0fSdSWrzb72KFxytOiihRi6r-3kLBNr3iRlAb0lxrAGHvlzSUwlAHGoH_YVzHtFv0GcKtJ1-MEz5A=s2560",
            "https://lh3.googleusercontent.com/drive-viewer/AKGpiha-sWAcc-Y4NJxUHvvEiunKOruHmiFokfUfKYNVe6Vtn_ztLUf2s5HwTCT9-qxKWZQRtDlCcirB1ZtqS3bKMz_XRePk5vJc-Mc=s2560",
            "https://lh3.googleusercontent.com/drive-viewer/AKGpihYC5zalNAuEdMUmRt0QpZVkfpNESi7qES4WqvaabHOvmMon9zmHJdDMkyxBFbssYuMDN2vXR2cPvE_DiI4oqrBesXVG0cTK6w=s2560"
        ];

        $('.pane').each(function(index) {
            const imageUrl = imageUrls[index];
            $(this).find('.image-container').append('<img src="' + imageUrl + '" alt="Slide Image">');
        });
    }

    // ANIMATE
    function UpdateScreen(operator) {
        $ActualSlide = $CibleSlide;
        let newIndex = $ListSlides.indexOf($ActualSlide);

        if (operator == "+") {
            newIndex += 1;
        } else {
            newIndex -= 1;
        }

        if (newIndex < 0 || newIndex >= $ListSlides.length) {
            $ScrollState = false;
            return;
        }

        $CibleSlide = $ListSlides[newIndex];
        $('#Helper').html("From <strong>" + $ActualSlide + "</strong> to <strong>" + $CibleSlide + "</strong>"); // helper
        $ActualSlideDOM = $('.pane[data-id=' + $ActualSlide + ']');
        $CibleSlideDOM = $('.pane[data-id=' + $CibleSlide + ']');
        $ActualSlideDOM.removeClass('visible'); // Remove visible class from current slide
        // Scroll To : Greensock GSAP
        gsap.to(window, {
            duration: $ScrollSpeed,
            scrollTo: { y: $CibleSlideDOM.offset().top },
            ease: "power2.out",
            onComplete: function() {
                $ScrollState = false;
                $CibleSlideDOM.addClass('visible'); // Add visible class to target slide
            }
        });
    }

    // Init() On Resize
    $(window).resize(function() {
        Init();
    });
});
