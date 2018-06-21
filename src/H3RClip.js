import * as THREE from "three-full";
import GLTFLoader from "three-gltf-loader";
import { OrbitControl } from "three-addons";

const loader = new GLTFLoader();

var H3RClip = function(data, container) {
  this.clock = new THREE.Clock();
  this.container = container;
  this.scene     = new THREE.Scene();
  this.actions   = [];
  this.mixers = [];
  global.scene = this.scene;
  
  var 
    width = container.offsetWidth,
    height = container.offsetHeight;
  this.camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
  this.renderer = new THREE.WebGLRenderer( {antialias: true} );
  this.container.appendChild( this.renderer.domElement );
  this.camera.position.z = 5;
  this.scene.add(new THREE.HemisphereLight(0xffffff, 0x222222, 1.2));
  this.scene.background = new THREE.Color( 0xffffff );
  this.addFromFile("../../data/gltf/cube/cube-1.glb");
  this.addFromFile("../../data/gltf/cube/cube-2.glb"); 
  this.control = new THREE.OrbitControls( this.camera , this.container );
  this.control.update();

  this.animate();
}

H3RClip.prototype.addFromFile = function(path) {
  loader.load(path, function(gltf) {
    this.scene.add(gltf.scene);
    this.scene.traverse(function (object) {
      object.frustumCulled = false;
    });
    var mixer = new THREE.AnimationMixer(gltf.scene);
    var action = mixer.clipAction(gltf.animations[0]);
    this.mixers.push(mixer);
    console.log(this.mixers);
  }.bind(this));
}

H3RClip.prototype.animate = function() {
  requestAnimationFrame( this.animate.bind(this) );
  var 
    width = this.container.offsetWidth - 6,
    height = this.container.offsetHeight - 6;
  this.camera.aspect = width / height;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize( width , height);
  this.control.update();
  this.renderer.render( this.scene, this.camera );
  if (this.mixers[0]  && this.mixers[1]) {
    this.mixers[0].update(this.clock.getDelta());
    this.mixers[1].update(this.clock.getDelta());
  }

//this.mixers.forEach(function(mixer) {
//  mixer.update( this.clock.getDelta() );
//}.bind(this))
}

export default H3RClip;
