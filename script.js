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
        
            // Init
            function Init() {
                $ScrollSpeed = 0.3; // Animation speed
                $ScrollState = false; // Scroll possible if True - If False anim already in progress
                $ActualSlide = $CibleSlide = $('.pane').first().attr('data-id'); // First slide
                $ListSlides = new Array();
                $('.pane').each(function() {
                    $ListSlides.push($(this).attr('data-id'));
                }); // List of slides (.pane)
                gsap.to(window, { duration: 0, scrollTo: { y: 0 } });
                gsap.to('.spane', { duration: 0, scrollTo: { y: 0, x: 0 } });
                $('.visible').removeClass('visible');
                $('#Helper').html("Init()"); // Helper
            }
        
            // ANIMATE
            function UpdateScreen(operator) {
                $ActualSlide = $CibleSlide;
                if(operator == "+") {
                    $CibleSlide = $ListSlides[$ListSlides.indexOf($ActualSlide) + 1];
                } else {
                    $CibleSlide = $ListSlides[$ListSlides.indexOf($ActualSlide) - 1];
                } // If + next slide / if - previous slide
                $('#Helper').html("From <strong>" + $ActualSlide + "</strong> to <strong>" + $CibleSlide + "</strong>"); // helper
                if(!$CibleSlide) {
                    $ScrollState = false;
                    $('#Helper').html("Break");
                    $CibleSlide = $ActualSlide;
                    return;
                } // Stops everything if there is no slide before/after
                $ActualSlideDOM = $('.pane[data-id=' + $ActualSlide + ']');
                $CibleSlideDOM = $('.pane[data-id=' + $CibleSlide + ']');
                // Scroll To : Greensock GSAP
                if($ActualSlideDOM.closest('.prt').find('.spane').length && 
                   (operator == "+" && $ActualSlideDOM.next('.pane').length || operator == "-" && $ActualSlideDOM.prev('.pane').length)) {
                    gsap.to($ActualSlideDOM.closest('.spane'), {
                        duration: $ScrollSpeed,
                        scrollTo: { y: $CibleSlideDOM.position().top },
                        ease: "power2.out",
                        onComplete: function() {
                            $ScrollState = false;
                            $CibleSlideDOM.addClass('visible');
                        }
                    });
                } else {
                    gsap.to(window, {
                        duration: $ScrollSpeed,
                        scrollTo: { y: $CibleSlideDOM.offset().top },
                        ease: "power2.out",
                        onComplete: function() {
                            $ScrollState = false;
                            $CibleSlideDOM.addClass('visible');
                        }
                    });
                }
            }
        
            // Init() On Resize
            $(window).resize(function() {
                Init();
            });
        });