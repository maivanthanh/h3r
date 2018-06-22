import $ from "jquery";

var GUI = function(container) {
  this.container = $(container);
  this.container.css("position", "relative");
  this.initView();
  this.initGUI();
}

GUI.prototype.initView = function() {
  var c = this.container;
  c.append("<div class='h3r-view'> </div>");
  this.jviewContainer = c.find(".h3r-view").first();
  this.ViewContainer = this.jviewContainer[0];


  this.jviewContainer.css({
    width:  "100%",
    height: "100%",
    margin: "0px",
    "border" : "3px solid black"
  });

}

GUI.prototype.initGUI = function() {
  this.container.append("<div class='h3r-gui'> </div>");
  this.jGUIcontainer = this.container.find(".h3r-gui").first();
  this.GUIcontainer = this.jGUIcontainer[0];
  this.initPlayBtn();
  this.initSlider();
  this.jGUIcontainer.css( {
    "position" : "absolute",
    "bottom": "0px",
    "width" : "100%"
  });
}

GUI.prototype.On = function(event, handler) {

}

GUI.prototype.ViewSize = function() {
  var 
    width = this.jviewContainer.width(),
    height = this.jviewContainer.height(); 
  return {
    width: width,
    height: height,
    ratio : width / height
  };
}

GUI.prototype.initSlider = function(){
  this.jGUIcontainer.append("<input type='range' id='h3r-slider'>");
}

GUI.prototype.initPlayBtn = function() {
  var c = this.jGUIcontainer;
  c.append("<button id='h3r-play-btn'> Play </button>");

  c.css("position", "absolute");
  var play = c.find('button#h3r-play-btn');
  this.jplay = play;

  play.css({
    "position" : "absolute",
    "bottom" : "1%", 
    "left" : "1%",
    "font-size" : "14pt",
  });
}


export default GUI;
