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
    if ( !container) {
        console.error("Container must be provied");
        return;
    }

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


    /** @private **/

    /** @type {OrbitControl} */
    this._controls = null;

    this._initCamera();
    this._initScene();
    this._initRenderer();
    this._initControls();
    this._initResize();
    this._initLight();
    this._animate();
}

/**
 * Override h3r data
 * @param {string} url
 */

Clip.prototype.appendH3R = function(url) {
    var context = this;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var serverResponse = this.responseText;
            var h3r = JSON.parse(serverResponse);
            h3r.gltf.forEach(function(gltf) {
                context.appendGLTF(gltf);
            });
        }
    }

    xhttp.open("GET", url, true);
    xhttp.send();
}


/**
 * Add gltf from url  ( no cross origin )
 * @param {string} url
 */

Clip.prototype.appendGLTF = function (url) {
    var context = this;
    gltfLoader.load(url, function (gltf) {
        gltf.scene.traverse(function (object) {
            object.frustumCulled = false;
            if (object.isMesh) {
                object.material.side = THREE.DoubleSide;
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });

        context.scene.add(gltf.scene);

    })
}

/** @private **/

Clip.prototype._size = function () {
    return {
        width: this.container.clientWidth,
        height: this.container.clientHeight,
        ratio: this.container.clientWidth / this.container.clientHeight
    }
}


Clip.prototype._initLight = function() {

    var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 2 );
    this.scene.add( light );
}

Clip.prototype._initCamera = function () {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
}

Clip.prototype._initScene = function () {

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshPhongMaterial({ color: 0xffffff});
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

Clip.prototype._initResize = function() {
    var context = this;
    window.addEventListener( 'resize', onWindowResize, false );

    function onWindowResize(){

        context.camera.aspect = context._size().ratio;
        context.camera.updateProjectionMatrix();

        context.renderer.setSize(context._size().width, context._size().height, false);

    }
}

export { Clip }
