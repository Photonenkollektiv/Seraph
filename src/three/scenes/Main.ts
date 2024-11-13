import { AmbientLight, Color, Light, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { makeCamera, makeRenderer } from "../lib/generators";
import { BaseGenerator } from "../generators/BaseGenerator";
import { CubeGenerator } from "../generators/CubeGenerator";
import { BPMController } from "../controllers/BpmController";

export class MainScene extends Scene {
    private renderer!: WebGLRenderer;
    private camera!: PerspectiveCamera;
    private ambientLight!: Light;
    private generator: BaseGenerator;
    // private positionEffect: BasePositionEffect;
    // private intensityEffect: BaseIntensityEffect;
    private bpmController = new BPMController();

    constructor(uiEl: HTMLElement) {
        super();
        this.setupBasics(uiEl);
        this.setupLights();

        this.generator = new CubeGenerator(this);
        // this.positionEffect = new WaveEffect();
        // this.intensityEffect = new DimChaseEffect();
        // this.bpmController.registerHandle((time, isBeat) => {
        //     this.intensityEffect.update(this.generator.meshes, time, this.bpmController.getBPM(), isBeat);
        // });

        requestAnimationFrame(this.animate);
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
        this.camera = makeCamera();
        uiEl.appendChild(this.renderer.domElement);
        this.renderer.render(this, this.camera);
        this.background = new Color("#000000")
    }


    private setupLights = () => {
        this.ambientLight = new AmbientLight(new Color("#fffff"), 0);
        this.add(this.ambientLight);
    }

    private animate = (time: number) => {
        this.update(time)
        this.renderer.render(this, this.camera);
        requestAnimationFrame(this.animate);
    }

}