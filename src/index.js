import H3RClip from "./H3RClip.js";

function CreateClip(container) {
  return new H3RClip(undefined, container);
}
var h3r = { 
  CreateClip : CreateClip
}

global.h3r = h3r;
export default h3r;
