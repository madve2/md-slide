var slideCount;

function prepareSlides() {
  var elements = $("body > *");
  for(var i = 0, currentSlide = $(); i< elements.length; i++)
  {
    if (elements[i].tagName != "HR"
    && elements[i].tagName != "FOOTER"
    && elements[i].tagName != "SCRIPT") {
      currentSlide = currentSlide.add($(elements[i]));
    }

    if (elements[i].tagName == "HR" || i == (elements.length - 1)) {
      currentSlide.wrapAll("<div class='slide' />");
      if (elements[i].tagName == "HR") { $(elements[i]).hide(); }
      currentSlide = $();
    }
  }

  $(".slide").wrapAll("<div class='slideDeck' />");


  //Hide quotes from slide view. CSS could suffice, but then :last-child-style selectors would be a lot harder to write properly
  $("blockquote").remove();
}

$(function() {

  prepareSlides();

  slideCount = $(".slide").length; //Used by the presenter script. I'm a bit ashamed by this solution.
});
