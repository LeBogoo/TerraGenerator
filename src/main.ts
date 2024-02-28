import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "@three-ts/orbit-controls";
import { GUI } from "dat.gui";
import { TerrariumOptions } from "./terrarium-options";
import { RNG } from "./rng";
import { Bottom } from "./parts/bottom";
import { Side } from "./parts/side";
import { Door } from "./parts/frontModules/door";
import { Back } from "./parts/back";
import { Top } from "./parts/top";
import { Front } from "./parts/front";
import { Glass } from "./parts/frontModules/glass";
import { Vent } from "./parts/frontModules/vent";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(70, 70, 70);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.center.set(0, 50, 0);

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
    height: 100,
    depth: 39,
    glassThickness: 0.8,
    door: {
        height: 55,
        offset: 30,
    },
    offset: 0,
    ventilation: {
        height: 5,
    },
};

const gui = new GUI();
const terrariumFolder = gui.addFolder("Terrarium (units in cm)");
terrariumFolder.add(terrariumOptions, "glassThickness", 0.1, 5, 0.1).onChange(generateTerrarium);

const doorFolder = terrariumFolder.addFolder("Doors");
const doorHeightOption = doorFolder
    .add(terrariumOptions.door, "height", 0, terrariumOptions.height - terrariumOptions.door.offset, 0.1)
    .onChange(generateTerrarium);

const doorOffsetOption = doorFolder
    .add(terrariumOptions.door, "offset", 0, terrariumOptions.height, 0.1)
    .onChange((val) => {
        doorHeightOption.max(terrariumOptions.height - val);
        doorHeightOption.setValue(Math.min(doorHeightOption.getValue(), terrariumOptions.height - val));
        generateTerrarium();
    });

doorFolder.open();

const ventilationFolder = terrariumFolder.addFolder("Ventilation");
const ventilationHeightOption = ventilationFolder
    .add(terrariumOptions.ventilation, "height", 0, 20, 0.1)
    .onChange(generateTerrarium);
// TODO - Fix door height when vent is changed

ventilationFolder.open();

const wallsFolder = terrariumFolder.addFolder("Walls");
wallsFolder.add(terrariumOptions, "width", 10, 200, 0.1).onChange(generateTerrarium);

wallsFolder.add(terrariumOptions, "height", 10, 200, 0.1).onChange((val) => {
    doorHeightOption.max(val - terrariumOptions.door.offset);
    doorHeightOption.setValue(Math.min(doorHeightOption.getValue(), val));
    doorHeightOption.updateDisplay();

    doorOffsetOption.max(val);
    doorOffsetOption.setValue(Math.min(doorOffsetOption.getValue(), val - terrariumOptions.glassThickness));
    doorOffsetOption.updateDisplay();

    generateTerrarium();
});
wallsFolder.add(terrariumOptions, "depth", 10, 200, 0.1).onChange(generateTerrarium);
wallsFolder.open();

gui.add(terrariumOptions, "offset", 0, 10, 0.1).onChange(generateTerrarium);
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

    panes.push(new Bottom().generate(terrariumOptions, getMaterial(rng)));
    panes.push(new Top().generate(terrariumOptions, getMaterial(rng)));
    panes.push(new Back().generate(terrariumOptions, getMaterial(rng)));
    panes.push(new Side(-1).generate(terrariumOptions, getMaterial(rng)));
    panes.push(new Side(1).generate(terrariumOptions, getMaterial(rng)));

    panes.push(
        ...new Front(
            new Glass(terrariumOptions.door.offset)
                .setChild(new Vent(terrariumOptions.ventilation.height))
                .setChild(new Door(terrariumOptions.door.height))
                .setChild(new Vent(terrariumOptions.ventilation.height))
                .setChild(
                    new Glass(
                        terrariumOptions.height -
                            terrariumOptions.door.offset -
                            terrariumOptions.door.height -
                            terrariumOptions.ventilation.height * 2
                    )
                )
                .getRoot(),
            getMaterial,
            rng
        ).generate(terrariumOptions, [])
    );

    scene.add(...panes);
}

function render() {
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
}
render();
generateTerrarium();
