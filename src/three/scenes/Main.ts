import { AmbientLight, Color, Light, Mesh, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { makeRenderer } from "../lib/generators";
import { BPMController } from "../controllers/BpmController";
import WorldGrid from "../generators/world/WorldGrid";
import CameraController from "../controllers/CameraController";
import CameraController2 from "../controllers/CameraController2";

export class MainScene extends Scene {
    private renderer!: WebGLRenderer;
    private ambientLight!: Light;
    private worldGrid: WorldGrid = new WorldGrid(100, 10);
    private cameraController: CameraController2;
    private bpmController = new BPMController();
    private camera: PerspectiveCamera;
    constructor(uiEl: HTMLElement) {
        super();
        this.setupBasics(uiEl);
        this.setupLights();
        this.camera = new PerspectiveCamera(75, uiEl.clientWidth / uiEl.clientHeight, 0.1, 1000);
        this.cameraController = new CameraController2(this.camera, uiEl)
        this.add(this.worldGrid.getGrid());
        requestAnimationFrame(this.animate);
        this.worldGrid.toggleVisibility(false);
    }

    static create(uiEl: HTMLElement) {
        return new MainScene(uiEl);
    }

    private update = (time: number) => {
        // this.positionEffect.animate(this.generator.meshes, time);
        this.bpmController.update(time);
    }

    private setupBasics = (uiEl: HTMLElement) => {
        this.renderer = makeRenderer(uiEl.clientWidth, uiEl.clientHeight);
        uiEl.appendChild(this.renderer.domElement);
        this.background = new Color("#000000")
    }


    private setupLights = () => {
        this.ambientLight = new AmbientLight(new Color("#ffffff"), 10);
        this.add(this.ambientLight);
    }

    private animate = (time: number) => {
        this.update(time)
        this.cameraController.update()
        this.renderer.render(this, this.camera);
        requestAnimationFrame(this.animate);
    }

    public mountEventListeners = () => {
        // this.cameraController.remountEventListeners();
    }

    public focusOn = (object: Mesh) => {
        this.cameraController.focusOn(object);
    }

}