import * as THREE from "three-full";
import GLTFLoader from "three-gltf-loader";
import { OrbitControl } from "three-addons";
import GUI from  "./gui/GUI.js";

const loader = new GLTFLoader();

var H3RClip = function(data, container) {
  
  this.clock    = new THREE.Clock();
  this.scene    = new THREE.Scene();
  this.duration = 0;
  this.time     = 0;
  this.state    = "play";
  
  this.actions = [];
  
  this.initGUI(container);
  this.initScene();
  this.initControl();
  
  this.addFromFile("../../data/gltf/sketfab/backflip/scene.gltf");

  this.animate();
}

H3RClip.prototype.initScene = function() {
  var size = this.GUI.ViewSize();
  this.camera = new THREE.PerspectiveCamera( 75, size.ratio , 0.1, 1000 );
  this.renderer = new THREE.WebGLRenderer( {antialias: true} );
  this.container.appendChild( this.renderer.domElement );
  this.camera.position.z = 5;
  this.scene.add(new THREE.HemisphereLight(0xffffff, 0x222222, 1.3));

  this.scene.background = new THREE.Color( 0xffffff );

}

H3RClip.prototype.initControl = function() {
  this.control = new THREE.OrbitControls( this.camera , this.container );
  this.control.update();
}

H3RClip.prototype.Pause = function() {
  this.state = "pause";
  this.actions.forEach((action) => action.paused = true);
}

H3RClip.prototype.Play = function() {
  this.state = "play";
}

H3RClip.prototype.Time = function(time) {
  this.time = time ? time : this.time;
  return this.mixer.time;
}

H3RClip.prototype.initGUI = function(container) {
  this.GUI = new GUI(container, this);
  this.container = this.GUI.ViewContainer;
}

H3RClip.prototype.addFromFile = function(path) {
  loader.load(path, function(gltf) {
    global.gltf = gltf;
    gltf.scene.scale.x = 0.01;
    gltf.scene.scale.y = 0.01;
    gltf.scene.scale.z = 0.01;

    this.scene.add(gltf.scene);
    
    this.scene.traverse(function (object) {
      object.frustumCulled = false;
    });
    this.mixer = new THREE.AnimationMixer(gltf.scene);
    if (!gltf.animations) return;

    gltf.animations.forEach(function(animation) {
      var action = this.mixer.clipAction(animation);
      this.actions.push(action);
      action.play();
      this.GUI.duration =
        Math.max(this.GUI.duration, animation.duration);
      this.duration = 
        Math.max(this.duration, animation.duration);
    }.bind(this));
    
    global.mixer = this.mixer;
  }.bind(this),
  function ( xhr ) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  }
  );
}

H3RClip.prototype.toggle = function() {
  this.state = (this.state == "play") ? "pause" : "play";
}

H3RClip.prototype.animate = function() {

  requestAnimationFrame( this.animate.bind(this) );
  var size = this.GUI.ViewSize();
  this.camera.aspect = size.ratio;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize( size.width, size.height );
  this.control.update();
  this.renderer.render( this.scene, this.camera );

  var delta = this.clock.getDelta();
   
  if (!this.mixer) return;
  

  this.mixer.update(0);

  if (this.state == "play") {
    this.GUI.Time(this.time);
    this.time += delta;
  }

  this.actions.forEach(function(action) {
    action.time = this.time;
  }.bind(this));


  if (this.time > this.duration) {
    this.time -= this.duration;
  }

}

export default H3RClip;
