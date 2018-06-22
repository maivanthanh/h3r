import * as THREE from "three-full";
import GLTFLoader from "three-gltf-loader";
import { OrbitControl } from "three-addons";
import GUI from  "./gui/GUI.js";

const loader = new GLTFLoader();

var H3RClip = function(data, container) {
  
  this.initGUI(container);
  this.clock = new THREE.Clock();
  this.scene = new THREE.Scene();
  this.duration = 0;
  this.state = "play";
  global.scene = this.scene;
  
  var size = this.GUI.ViewSize();
  this.camera = new THREE.PerspectiveCamera( 75, size.ratio , 0.1, 1000 );
  this.renderer = new THREE.WebGLRenderer( {antialias: true} );
  this.container.appendChild( this.renderer.domElement );
  this.camera.position.z = 5;
  this.scene.add(new THREE.HemisphereLight(0xffffff, 0x222222, 3));

  this.scene.background = new THREE.Color( 0xffffff );
  this.addFromFile("../../data/gltf/girl/girl-lowpoly-rig.gltf");

  this.control = new THREE.OrbitControls( this.camera , this.container );
  this.control.update();

  this.animate();
}

H3RClip.prototype.Pause = function() {
  this.state = "pause";
}

H3RClip.prototype.Time = function(time) {
}

H3RClip.prototype.initGUI = function(container) {
  this.GUI = new GUI(container);
  this.container = this.GUI.ViewContainer;
}

H3RClip.prototype.addFromFile = function(path) {
  loader.load(path, function(gltf) {
    global.gltf = global.gltf ? global.gltf : [];
    global.gltf.push(gltf);
    this.scene.add(gltf.scene);
    this.scene.traverse(function (object) {
      object.frustumCulled = false;
    });
    this.mixer = new THREE.AnimationMixer(gltf.scene);
    if (!gltf.animations) return;

    gltf.animations.forEach(function(animation) {
      this.mixer.clipAction(animation).play();
      console.log(animation);
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

H3RClip.prototype.animate = function() {

    requestAnimationFrame( this.animate.bind(this) );
  var size = this.GUI.ViewSize();
  this.camera.aspect = size.ratio;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize( size.width, size.height );
  this.control.update();
  this.renderer.render( this.scene, this.camera );
  var delta = this.clock.getDelta();
  if ( this.mixer  && this.state == "play" ) {
    this.mixer.update(delta);
    this.GUI.Time(this.mixer.time);
    if (this.mixer.time > this.duration) {
      this.mixer.time -= this.duration;
    }
//    console.log(this.GUI.duration, this.GUI.currentTime);
  }
}

export default H3RClip;
