var currentSlide;

function switchToSlide(slideIdx) {
  if (slideIdx < 1) { /* 0 is the overview */
    showAllSlides();
    return;
  }

  //Sync active slide if we can
  if (connection) {
    try {
      connection.send(slideIdx);
    } catch (_) {
      console.log("Can't sync with server");
    }
  }

  $("body").addClass("inSlideShow");
  var slides = $(".slide");
  slides.addClass("hidden");
  $(slides[slideIdx - 1]).removeClass("hidden"); /* We index slides from 1, but of course, the array does not */

  //If the rescale script is loaded, activate it
  if (rescale) {
    rescale();
  }
}

function showAllSlides() {
  $("body").removeClass("inSlideShow");
  var slides = $(".slide");
  slides.removeClass("hidden");
  
  //Remove custom scaling when showing the overview
  if (rescale)
    slides.css("transform", "scale(1)").css("top", "0").css("left", "0");
}

function checkSlideChange () {
  if (!window.location.hash || window.location.hash == "#") {
    window.location.hash = "#" + currentSlide;
  }

  var newSlideIdx = parseInt(window.location.hash.substring(1));

  if (isNaN(newSlideIdx)) return;

  if (newSlideIdx != currentSlide) {
    currentSlide = Math.min(Math.max(newSlideIdx, 0), slideCount); /* 1-től indexeljük a slide-okat, de a 0 is valid érték, mert az az áttekintő */
    switchToSlide(currentSlide);
  }
}

$(function() {
  currentSlide = 0;

  $(document).keyup(function(e){
    var switchTo = currentSlide;

    if (e.keyCode == 37) { //left
      switchTo = Math.max( currentSlide - 1, 0);  
    }
    else if (e.keyCode == 35 || e.keyCode == 69) { //'end' or 'e'
      switchTo = 0;
    }
    else if (e.keyCode == 39) { //right
      switchTo = Math.min( currentSlide + 1, slideCount); //slideCount is declared in another script; it's hacky, sorry about that
    }

    if (switchTo != currentSlide) {
      currentSlide = switchTo;
      window.location.hash = "#" + currentSlide;
      switchToSlide(currentSlide);
    }
  });

  $(window).hashchange( function(){
    checkSlideChange();
  });

  checkSlideChange();

  //websocket connection for syncing the active slide
  connect();

  //If the rescale script is loaded, activate it
  if (rescale) {
    rescale();
    window.addEventListener("resize", rescale);
  }
});
