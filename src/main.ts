import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "@three-ts/orbit-controls";
import { GUI } from "dat.gui";
import { TerrariumOptions } from "./terrarium-options";
import { RNG } from "./rng";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(50, 70, 50);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.center.set(0, 20, 0);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(25, 100, 50);
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight2.position.set(-25, -100, -50);
scene.add(directionalLight2);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const terrariumOptions: TerrariumOptions = {
  width: 39,
  height: 50,
  depth: 39,
  glassThickness: 0.8,
  door: {
    height: 30,
    offset: 10,
    gap: 0,
  },
};

const extraOptions = {
  offset: 0,
};

const gui = new GUI();
const terrariumFolder = gui.addFolder("Terrarium (units in cm)");
terrariumFolder
  .add(terrariumOptions, "glassThickness", 0.1, 5, 0.1)
  .onChange(generateTerrarium);

const doorFolder = terrariumFolder.addFolder("Doors");
const doorHeightOption = doorFolder
  .add(
    terrariumOptions.door,
    "height",
    0,
    terrariumOptions.height - terrariumOptions.door.offset,
    0.1
  )
  .onChange(generateTerrarium);

const doorOffsetOption = doorFolder
  .add(terrariumOptions.door, "offset", 0, terrariumOptions.height, 0.1)
  .onChange((val) => {
    doorHeightOption.max(terrariumOptions.height - val);
    doorHeightOption.setValue(
      Math.min(doorHeightOption.getValue(), terrariumOptions.height - val)
    );
    generateTerrarium();
  });

doorFolder.open();

const wallsFolder = terrariumFolder.addFolder("Walls");
wallsFolder
  .add(terrariumOptions, "width", 10, 200, 0.1)
  .onChange(generateTerrarium);

wallsFolder.add(terrariumOptions, "height", 10, 200, 0.1).onChange((val) => {
  doorHeightOption.max(val - terrariumOptions.door.offset);
  doorHeightOption.setValue(Math.min(doorHeightOption.getValue(), val));
  doorHeightOption.updateDisplay();

  doorOffsetOption.max(val);
  doorOffsetOption.setValue(
    Math.min(doorOffsetOption.getValue(), val - terrariumOptions.glassThickness)
  );
  doorOffsetOption.updateDisplay();

  generateTerrarium();
});
wallsFolder
  .add(terrariumOptions, "depth", 10, 200, 0.1)
  .onChange(generateTerrarium);
wallsFolder.open();

gui.add(extraOptions, "offset", 0, 10, 0.1).onChange(generateTerrarium);
terrariumFolder.open();

const getMaterial = (rng: RNG) =>
  new THREE.MeshLambertMaterial({
    color: rng.next(),
    wireframe: false,
  });

let panes: THREE.Mesh[] = [];
function generateTerrarium() {
  panes.forEach((pane) => scene.remove(pane));
  panes = [];

  const rng = new RNG(0);

  // BOTTOM
  const bottom = new THREE.Mesh(
    new THREE.BoxGeometry(
      terrariumOptions.width - terrariumOptions.glassThickness * 2,
      terrariumOptions.glassThickness,
      terrariumOptions.depth - terrariumOptions.glassThickness * 2
    ),
    getMaterial(rng)
  );
  bottom.position.y = terrariumOptions.glassThickness / 2 - extraOptions.offset;
  panes.push(bottom);

  // TOP
  const top = new THREE.Mesh(
    new THREE.BoxGeometry(
      terrariumOptions.width,
      terrariumOptions.glassThickness,
      terrariumOptions.depth - terrariumOptions.glassThickness
    ),
    getMaterial(rng)
  );
  top.position.y =
    terrariumOptions.height -
    terrariumOptions.glassThickness / 2 +
    extraOptions.offset;
  top.position.z = -terrariumOptions.glassThickness / 2;
  panes.push(top);

  // BACK
  const back = new THREE.Mesh(
    new THREE.BoxGeometry(
      terrariumOptions.width,
      terrariumOptions.height - terrariumOptions.glassThickness,
      terrariumOptions.glassThickness
    ),
    getMaterial(rng)
  );
  back.position.y =
    terrariumOptions.height / 2 - terrariumOptions.glassThickness / 2;
  back.position.z =
    -terrariumOptions.depth / 2 +
    terrariumOptions.glassThickness / 2 -
    extraOptions.offset;
  panes.push(back);

  // SIDE 1
  const side1 = new THREE.Mesh(
    new THREE.BoxGeometry(
      terrariumOptions.glassThickness,
      terrariumOptions.height - terrariumOptions.glassThickness,
      terrariumOptions.depth - terrariumOptions.glassThickness * 2
    ),
    getMaterial(rng)
  );
  side1.position.y =
    terrariumOptions.height / 2 - terrariumOptions.glassThickness / 2;
  side1.position.x =
    -terrariumOptions.width / 2 +
    terrariumOptions.glassThickness / 2 -
    extraOptions.offset;
  panes.push(side1);

  // SIDE 2
  const side2 = new THREE.Mesh(
    new THREE.BoxGeometry(
      terrariumOptions.glassThickness,
      terrariumOptions.height - terrariumOptions.glassThickness,
      terrariumOptions.depth - terrariumOptions.glassThickness * 2
    ),
    getMaterial(rng)
  );

  side2.position.y =
    terrariumOptions.height / 2 - terrariumOptions.glassThickness / 2;
  side2.position.x =
    terrariumOptions.width / 2 -
    terrariumOptions.glassThickness / 2 +
    extraOptions.offset;
  panes.push(side2);

  // DOOR 1
  const door1 = new THREE.Mesh(
    new THREE.BoxGeometry(
      terrariumOptions.width / 2,
      terrariumOptions.door.height,
      terrariumOptions.glassThickness
    ),
    getMaterial(rng)
  );

  door1.position.x = -terrariumOptions.width / 4;
  door1.position.y =
    terrariumOptions.door.offset + terrariumOptions.door.height / 2;

  door1.position.z =
    terrariumOptions.depth / 2 -
    terrariumOptions.glassThickness / 2 +
    extraOptions.offset;
  if (terrariumOptions.door.height != 0) panes.push(door1);

  // DOOR 2
  const door2 = door1.clone();
  door2.material = getMaterial(rng);
  door2.position.x = terrariumOptions.width / 4;
  if (terrariumOptions.door.height != 0) panes.push(door2);

  // FRONT BOTTOM
  const frontBottom = new THREE.Mesh(
    new THREE.BoxGeometry(
      terrariumOptions.width,
      terrariumOptions.door.offset,
      terrariumOptions.glassThickness
    ),
    getMaterial(rng)
  );

  frontBottom.position.y = terrariumOptions.door.offset / 2;

  frontBottom.position.z =
    terrariumOptions.depth / 2 -
    terrariumOptions.glassThickness / 2 +
    extraOptions.offset;
  if (terrariumOptions.door.offset != 0) panes.push(frontBottom);

  // FRONT TOP
  const frontTopHeight =
    terrariumOptions.height -
    (terrariumOptions.door.offset + terrariumOptions.door.height);
  const frontTop = new THREE.Mesh(
    new THREE.BoxGeometry(
      terrariumOptions.width,
      frontTopHeight,
      terrariumOptions.glassThickness
    ),
    getMaterial(rng)
  );

  frontTop.position.y = terrariumOptions.height - frontTopHeight / 2;
  frontTop.position.z =
    terrariumOptions.depth / 2 -
    terrariumOptions.glassThickness / 2 +
    extraOptions.offset;
  if (frontTopHeight != 0) panes.push(frontTop);

  scene.add(...panes);
}

function render() {
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);
}
render();
generateTerrarium();
