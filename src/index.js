import H3RClip from "./H3RClip.js";
import $ from "jquery";

var h3r = { 
  CreateClip : (url, container) =>  {
    var clip = new H3RClip(container);
    $.get(url, (data) => clip.Load(JSON.parse(data)) );
    return clip;
  }
}

global.h3r = h3r;
export default h3r;
