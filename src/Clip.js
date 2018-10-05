import * as THREE from "./libs/three.module"
import { GLTFLoader } from "./libs/GLTFLoader"
import { OrbitControls } from "./libs/OrbitControls"

const gltfLoader = new GLTFLoader();

/**
 * Assign clip to a canvas
 * @param {HTMLCanvasElement} container
 */
function Clip(container) {
  if (!container) {
    console.error("Container must be provied");
    return;
  }

  /** @public PUBLIC */
  this.duration  = 0;
  this.time      = 0;
  this.state     = 'pause' // play
  this.play      = play;
  this.pause     = pause;
  this.toggle    = () =>  { this.state == 'pause' ? play() : pause(); }
  this.appendH3R = appendH3R;

  /** @private PRIVATE */

  var 
  container = container,
  renderer      = null,
  clock         = new THREE.Clock(),
  scene         = new THREE.Scene(),
  camera        = null,
  actions       = [],
  mixers        = [],
  controls      = null;

  camera = createCamera();
  renderer = createRenderer(size(), container);
  controls = createControl(camera, container);

  window.addEventListener('resize', onWindowResize, false);

  function onWindowResize() {

    camera.aspect = size().ratio;
    camera.updateProjectionMatrix();

    renderer.setSize(size().width, size().height, false);

  }

  scene.add(new THREE.HemisphereLight(0xffffbb, 0x080820, 2));

  animate();

  /** PRIVATE FUNCTIONS */
  function animate() {
    var delta = clock.getDelta();
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
    controls.update();
    mixers.forEach((mixer) => { mixer.update(0); });

    actions.forEach(function (action) {
      action.time += delta;
    })
  }

  function appendGLTF(url) {

    gltfLoader.load(url, function (gltf) {
      var 
      gscene = gltf.scene,
      ganim = gltf.animations;

      gscene.traverse(fixObject); 
      scene.add(gltf.scene);

      var mixer = new THREE.AnimationMixer(gscene);
      mixers.push(mixer);
      if (!ganim) return;

      // Only one animation in scene
      ganim.forEach(anim => actions.push(mixer.clipAction(anim)) );
    })
  }

  function size() {
    return {
      width: container.clientWidth,
      height: container.clientHeight,
      ratio: container.clientWidth / container.clientHeight
    }

  }

  function appendH3R(url) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var serverResponse = this.responseText;
        var h3r = JSON.parse(serverResponse);
        h3r.gltf.forEach(function (gltf) {
          appendGLTF(gltf);
        });
      }
    }

    xhttp.open("GET", url, true);
    xhttp.send();
  }

  function play() {
    state = "play";
  }

  function pause(){
    state = "pause";
  }
}


function createControl(camera, container) {
  var controls = new OrbitControls(camera, container);

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.25;

  controls.screenSpacePanning = false;

  controls.minDistance = 1;
  controls.maxDistance = 100;

  controls.maxPolarAngle = Math.PI / 2;
  return controls;
}

function createCamera() {
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  camera.position.z = 75;
  camera.position.y = 30;
  return camera;
}

function createRenderer(size, container) {
  var renderer = new THREE.WebGLRenderer(
    {
      antialias: true,
      alpha: true,
      canvas: container
    }
  );
  renderer.setSize(size.width, size.height, false);
  return renderer;
}


function fixObject( object ) {

  object.frustumCulled = false;

  if (!object.isMesh) return;

  object.material.side = THREE.DoubleSide;
  object.castShadow    = true;
  object.receiveShadow = true;

}
export { Clip }
