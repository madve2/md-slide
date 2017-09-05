function rescale() {
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  var scaleFactor = Math.min( w / 1024, h / 768);

  var actualW = scaleFactor * 1024;
  var actualH = scaleFactor * 768;
  
  $("body.inSlideShow .slide:not(.hidden)").css("transform", "scale(" + scaleFactor + ")")
                                           .css("top", (h - actualH) / 2)
                                           .css("left", (w - actualW) / 2);
}