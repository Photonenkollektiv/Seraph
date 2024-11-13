import { AmbientLight, Color, Light, Scene, WebGLRenderer } from "three";
import { makeRenderer } from "../lib/generators";
import { BPMController } from "../controllers/BpmController";
import WorldGrid from "../generators/world/WorldGrid";
import CameraController from "../controllers/CameraController";

export class MainScene extends Scene {
    private renderer!: WebGLRenderer;
    private ambientLight!: Light;
    private worldGrid: WorldGrid = new WorldGrid(100, 10);
    private cameraController: CameraController;
    private bpmController = new BPMController();

    constructor(uiEl: HTMLElement) {
        super();
        this.setupBasics(uiEl);
        this.setupLights();
        this.cameraController = new CameraController(this.renderer, uiEl)
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
        this.renderer.render(this, this.cameraController.getCamera());
        requestAnimationFrame(this.animate);
    }

    public mountEventListeners = () => {
        this.cameraController.remountEventListeners();
    }

}