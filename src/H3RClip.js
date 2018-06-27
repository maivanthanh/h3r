import * as THREE from "three-full";
import GLTFLoader from "three-gltf-loader";
import { OrbitControl } from "three-addons";
import GUI from  "./gui/GUI.js";

const loader = new GLTFLoader();

var H3RClip = function(container) {
  
  this.clock    = new THREE.Clock();
  this.scene    = new THREE.Scene();
  this.duration = 0;
  this.time     = 0;
  this.state    = "play";
  this.actions  = [];
  
  this.initGUI(container);
  this.initCamera();
  this.initScene();
  this.initControl();

  this.animate();
}

H3RClip.prototype.Load = function(data) {

  data.gltf.forEach( function(url) {
    this.addFromFile(url);
  }.bind(this));

  this.audio = new Audio(data.bgm);
//  this.audio.play();
  this.Pause();
  this.GUI.updateState();
  
}


H3RClip.prototype.initCamera = function() {
  var size = this.GUI.ViewSize();
  /**
   * @todo auto adjust camera after load gltf file
   */
  this.camera = new THREE.PerspectiveCamera( 75, size.ratio , 0.1, 1000 );
  this.camera.position.z = 10;
  this.camera.position.y = 30;
  this.camera.position.x = 10;


}
H3RClip.prototype.initScene = function() {
  var size = this.GUI.ViewSize();
  this.renderer = new THREE.WebGLRenderer( {antialias: true} );
  this.container.appendChild( this.renderer.domElement );
  var l1 = new THREE.HemisphereLight(0xffffff, 0x222222, 1.3);
  l1.position.fromArray([1, 0, 0]);
  var l2 = new THREE.HemisphereLight(0xffffff, 0x222222, 1.3);
  l2.position.fromArray([0, 1, 0]);
  var l3 = new THREE.HemisphereLight(0xffffff, 0x222222, 1.3);
  l3.position.fromArray([0, 0, -1]);


  this.scene.add(l1);
  this.scene.add(l2);
  this.scene.add(l3);
  this.scene.background = new THREE.Color( 0xffffff );

}

H3RClip.prototype.initControl = function() {
  this.control = new THREE.OrbitControls( this.camera , this.container );
  this.control.update();
}

H3RClip.prototype.Pause = function() {
  this.state = "pause";
  this.actions.forEach((action) => action.paused = true);
  this.audio.pause();
}

H3RClip.prototype.Play = function() {
  this.state = "play";
  this.audio.currentTime = this.time;
  this.audio.play();
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
    gltf.scene.scale.x = .0005;
    gltf.scene.scale.y = .0005;
    gltf.scene.scale.z = .0005;

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

H3RClip.prototype.Toggle = function() {
  if (this.state == "play") {
    this.Pause();
  } else {
    this.Play();
  }
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
    this.audio.currentTime = this.time;
  }

}

export default H3RClip;
