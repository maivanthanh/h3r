import * as THREE from "./libs/three.module"
import { GLTFLoader } from "./libs/GLTFLoader"
import { OrbitControls } from "./libs/OrbitControls"

const gltfLoader = new GLTFLoader();

var ClipState = {
  PLAY: 1,
  PAUSE: 2
}

/**
 * Assign clip to a canvas 
 * @param {HTMLCanvasElement} container 
 */
function Clip(container) {
  /** @type {HTMLCanvasElement} */
  this.container = container;

  /** @type {THREE.WebGLRenderer} */
  this.renderer = null;

  /** @type {THREE.Clock} */
  this.clock = new THREE.Clock();

  /** @type {THREE.Scene} */
  this.scene = new THREE.Scene();

  /** @type {THREE.PerspectiveCamera} */
  this.camera = null;

  /** @type {THREE.Mesh} */
  this.cube = null;

  this.duration = 0;
  this.time = 0;
  this.state = ClipState.PAUSE;
  this.actions = [];

  /** @type {OrbitControl} */
  this._controls = null;

  this._initCamera();
  this._initScene();
  this._initRenderer();
  this._initControls();
  this._animate();
}

/**
 * Add gltf from url  ( no cross origin )
 * @param {string} url 
 */
Clip.prototype.appendGLTF = function (url) {
  var context = this;
  gltfLoader.load(url, function (gltf) {
    context.scene.add(gltf.scene);
  })
}

Clip.prototype._initCamera = function () {
  this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
}

Clip.prototype._initScene = function () {

  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  this.cube = new THREE.Mesh(geometry, material);
  this.scene.add(this.cube);

  this.camera.position.z = 5;

}

Clip.prototype._initRenderer = function () {
  this.renderer = new THREE.WebGLRenderer(
    {
      antialias: true,
      alpha: true,
      canvas: this.container
    }
  );
  this.renderer.setSize(this._size().width, this._size().height, false);
}

Clip.prototype._size = function () {
  return {
    width: this.container.clientWidth,
    height: this.container.clientHeight,
    ratio: this.container.clientWidth / this.container.clientHeight
  }
}

Clip.prototype._animate = function () {
  requestAnimationFrame(this._animate.bind(this));

  this.cube.rotation.x += 0.01;
  this.cube.rotation.y += 0.01;
  this.renderer.render(this.scene, this.camera);
  this._controls.update();
}

Clip.prototype._initControls = function () {
  var controls = new OrbitControls(this.camera, this.container);

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.25;

  controls.screenSpacePanning = false;

  controls.minDistance = 1;
  controls.maxDistance = 50;

  controls.maxPolarAngle = Math.PI / 2;
  this._controls = controls;
}

export { Clip }