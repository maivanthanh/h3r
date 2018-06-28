import $ from "jquery";

var GUI = function(container, clip) {
  this.container = $(container);
  this.container.css("position", "relative");
  this.clip        = clip;
  this.duration    = 0.0;
  this.currentTime = 0.0;

  this.initView();
  this.initGUI();
  this.Time();
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
  });

}

GUI.prototype.initGUI = function() {
  this.container.append("<div class='h3r-gui'> </div>");
  this.jGUIcontainer = this.container.find(".h3r-gui").first();
  this.GUIcontainer = this.jGUIcontainer[0];
  this.initPlayBtn();
  this.initVolume();
  this.initSlider();
  this.jGUIcontainer.css( {
    "position" : "absolute",
    "bottom": "0px",
    "width" : "98%",
    "left" : "1%",
    "background" : "rgba(255, 255, 255, 0.5)"
  });
}

GUI.prototype.initVolume = function() {
  var voldiv = $("<div class='h3r-volume-wrapper'></div>");

  var vol = $("<input type='range' class='h3r-volume-slider' min='0.0' max='1.0' step='any'>");
  var label = $("<p> vol </p>");
  vol.val(1);
  this.jVolume = vol;

  voldiv.append(label);
  voldiv.append("&nbsp;");
  voldiv.append(vol);
  this.jGUIcontainer.append(voldiv);
  voldiv.css({
    "position": "absolute", 
    "right" : "2%",
    "bottom" : "0%"
  });
  label.css({
    "display" : "inline-block"
  });

  vol.css({
    "vertical-align": "middle"
  });

  vol.on("input", function() {
    this.clip.audio.volume = this.jVolume.val();
  }.bind(this));
  
}

GUI.prototype.Time = function(time) {
  this.currentTime = time ? time : this.currentTime;
  if (this.duration == 0) {
    this.jslider.val(0);
    return;
  };
  var ratio = this.currentTime / this.duration;
  this.jslider.val(ratio);
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
  var slider = $("<input type='range' class='h3r-slider' min='0.0' max='1.0' step='any'>");
  this.jslider = slider;

  this.jGUIcontainer.append(slider);
  slider.css( {
    "display" : "inline-block",
    "width" : "99%"
  });

  slider
  .mousedown(function() {
    this.clip.Pause();
  }.bind(this))
  .mousemove(function() {
//    console.log(this.duration * this.jslider.val());
    var time = this.duration * this.jslider.val();
    this.clip.Time(time);
  }.bind(this))
  .mouseup(function() {
    this.clip.Play();
  }.bind(this));


}

GUI.prototype.initPlayBtn = function() {

  var c = this.jGUIcontainer;
  var play = $("<button id='h3r-play-btn'> Play </button>");
  this.jplay = play;

  c.append(play);
  c.css("position", "absolute");
  
  play.css({
    "display" : "inline-block",
    "font-size" : "14pt",
  });

  this.updateState();
  play.click(function() {
    this.clip.Toggle();
    this.updateState();
  }.bind(this));
}


GUI.prototype.updateState =  function() {
  this.jplay.html(this.clip.state == "pause" ? "Play" : "Pause");
}

export default GUI;
