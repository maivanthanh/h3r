import $ from "jquery";

var GUI = function(container) {
  this.container = $(container);
  this.initPlayBtn();

}

GUI.prototype.On = function(event, handler) {
}

GUI.prototype.initPlayBtn = function() {

  this.container.append("<button> Play </button>");
}


export default GUI;
