import * as THREE from "./libs/three.module"
import { GLTFLoader } from "./libs/GLTFLoader"
import { OrbitControls } from "./libs/OrbitControls"
import { Progress } from "./Progress"

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

  /** PUBLIC ATTRS/METHODS */
  var context = this;
  this.duration  = 0;
  this.time      = 0;
  this.state     = 'pause' // play
  this.play      = () => context.state = 'play';
  this.pause     = () => context.state = 'pause';
  this.toggle    = () =>  { context.state == 'pause' ? play() : pause(); }
  this.appendH3R = appendH3R;

  /** PRIVATE VARIABLES */

  var 
  container = container,
  renderer  = null,
  clock     = new THREE.Clock(),
  scene     = new THREE.Scene(),
  camera    = null,
  actions   = [],
  mixers    = [],
  controls  = null,
  progress  = new Progress;

  /** PRIVATE FUNCTIONS */

  function animate() {
    var delta = clock.getDelta();
    requestAnimationFrame(animate);
      mixers.forEach((mixer) => { mixer.update(0); });

    if (context.state == "play") {
      context.time += delta;
      console.log(context.time);
    }


    limit(context.time, context.duration);
    actions.forEach(function (action) {
      action.time = context.time;
    })
    controls.update();
    renderer.render(scene, camera);
  }

  function onWindowResize() {

    camera.aspect = size().ratio;
    camera.updateProjectionMatrix();

    renderer.setSize(size().width, size().height, false);

  }

  function appendGLTF(url) {

    gltfLoader.load(url, 
      function (gltf) {
        var 
        gscene = gltf.scene,
        ganims = gltf.animations;

        gscene.traverse(fixObject); 
        scene.add(gltf.scene);

        var mixer = new THREE.AnimationMixer(gscene);
        mixers.push(mixer);
        if (!ganims) return;

        // Only one animation in scene
        ganims.forEach((anim) => {
          var clip = mixer.clipAction(anim);
          context.duration = max(console.duration, anim.duration);
          actions.push(mixer.clipAction(anim)) 
          clip.play();
        });
        progress.oneDone();
      },
      function ( xhr ) {
        progress.triggerProgress(xhr);
      }
    )
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
        progress.needDone = h3r.gltf.length;
        h3r.gltf.forEach(function (gltf) {
          appendGLTF(gltf);
        });
      }
    }

    xhttp.open("GET", url, true);
    xhttp.send();
    return progress;
  }

  function play() {
    context.state = "play";
  }

  function pause(){
    context.state = "pause";
  }

  /** CONSTRUCTION **/
  camera = createCamera();
  renderer = createRenderer(size(), container);
  controls = createControl(camera, container);
  scene.add(new THREE.HemisphereLight(0xffffbb, 0x080820, 2));
  window.addEventListener('resize', onWindowResize, false);
  animate();

}

/** OUTER FUNCTIONS **/

function limit(target, value) {
  if (target > value) {
    target = value;
  }
}

function max(x, y) {
  return x > y ? x : y;
}

function createControl(camera, container) {
  var controls = new OrbitControls(camera, container);

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.25;

  controls.screenSpacePanning = false;

  controls.minDistance = 1;
  controls.maxDistance = 10000;

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
