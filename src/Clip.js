import * as THREE from "./libs/three.module.js";

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
  this.state = "play";
  this.actions = [];

  this._initCamera();
  this._initScene();
  this._initRenderer();
  this._animate();
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
  this.renderer.setSize(this._size().width, this._size().height);
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
}

export { Clip }