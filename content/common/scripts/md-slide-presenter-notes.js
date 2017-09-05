function injectAnchors() {
    var elements = $("body > h1:first-of-type, hr");
    for(var i = 0, currentSlide = $(); i < elements.length; i++)
    {
        var elem = elements[i];
        var slideIdx = i + 1;
        $(elem).before("<a name='" + slideIdx + "'></a>");
    }
}

$(function() {

  injectAnchors();

  connect();
});