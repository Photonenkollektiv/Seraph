import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { makeCamera, makeObjectsFromFile, makeRenderer, makeBlock } from './lib/generators.ts';
import { ObjectModel } from './lib/ObjectModel.ts';
import { Vector3 } from 'three';
import { CharacterController } from './CharacterController.ts';
import { randFloat } from 'three/src/math/MathUtils.js';

type keyloggerObject = { [key: string]: boolean }

export class SceneController {

    onWait: (() => void) | undefined;
    onReady: (() => void) | undefined;

    private waitState: number = 0;
    private scene: THREE.Scene;
    private loadingManager: THREE.LoadingManager;
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private oldCameraPosition: THREE.Vector3;
    private environment_scenes: ObjectModel[];
    public character: CharacterController;
    private ambientLight: THREE.Light
    private envBlocks: THREE.Mesh[]
    private backgroundColor: THREE.Color
    private blockColors: THREE.Color[]
    private AnimationMixers: THREE.AnimationMixer[]
    private AnimationClips: THREE.AnimationClip[]
    private AnimationActions: THREE.AnimationAction[]
    private vectorKeyframeTracks: THREE.VectorKeyframeTrack[][]
    private clock: THREE.Clock
    private keylogger: keyloggerObject
    private orbitcontrols: OrbitControls | undefined

    private constructor(uiEl: HTMLElement) {
        this.character = new CharacterController()
        this.envBlocks = []
        this.clock = new THREE.Clock()
        this.clock.start()
        this.AnimationMixers = []
        this.AnimationClips = []
        this.AnimationActions = []
        this.vectorKeyframeTracks = []
        this.environment_scenes = [];
        this.loadingManager = new THREE.LoadingManager();
        this.scene = new THREE.Scene();
        this.renderer = makeRenderer();
        this.camera = makeCamera();
        this.oldCameraPosition = new THREE.Vector3;
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0);
        this.backgroundColor = new THREE.Color("#000000")
        this.blockColors = [new THREE.Color("#FCA311"), new THREE.Color("#14213D"), new THREE.Color("#E5E5E5")]
        this.keylogger = {}
        this.orbitcontrols = undefined
        uiEl.appendChild(this.renderer.domElement);
        this.initDefaults()
        this.renderer.render(this.scene, this.camera);
        // window.addEventListener('pointermove', this.onPointerMove);
        // window.addEventListener('click', this.onClick)
        window.addEventListener('keydown', this.setKey)
        window.addEventListener('keyup', this.unsetKey)
        requestAnimationFrame(this.animate);
        this.loadingManager.onLoad = () => {
            this.changeWaitState(false);
        };
        this.loadingManager.onStart = () => {
            this.changeWaitState(true);
        }
    }
    private changeWaitState(waiting: boolean) {
        this.waitState += waiting ? +1 : -1;
        if (this.waitState == 0 && this.onReady) {
            this.onReady();
        }
        else if (this.waitState == 1 && this.onWait) {
            this.onWait();
        }
    }
    private setKey = (event: any) => {
        event.preventDefault()
        this.keylogger[event.key] = true
    }

    private unsetKey = (event: any) => {
        event.preventDefault()
        this.keylogger[event.key] = false
    }

    private changeMovementState = () => {
        let movementDirection = new Vector3(0, 0, 0)
        if (this.keylogger[" "] && this.keylogger["Shift"] === true) {
            movementDirection.add(new Vector3(0, 0, -0.2))
        } else if (this.keylogger[" "]) {
            movementDirection.add(new Vector3(0, 0, 0.2))
        } if (this.keylogger["y"]) {
            this.character.changeLightIntensity(0.5)
        } if (this.keylogger["x"]) {
            this.character.changeLightIntensity(-0.05)
        } if (this.keylogger["w"] || this.keylogger["ArrowUp"]) {
            movementDirection.add(new Vector3(0, 0.2, 0))
        } if (this.keylogger["s"] || this.keylogger["ArrowDown"]) {
            movementDirection.add(new Vector3(0, -0.2, 0))
        } if (this.keylogger["a"] || this.keylogger["ArrowLeft"]) {
            movementDirection.add(new Vector3(-0.2, 0, 0))
        } if (this.keylogger["d"] || this.keylogger["ArrowRight"]) {
            movementDirection.add(new Vector3(0.2, 0, 0))
        } 
        this.orbitcontrols?.target.set(this.character.position.x, this.character.position.y, this.character.position.z)
        this.character.moveInDirection(movementDirection)
        this.oldCameraPosition.copy(this.camera.position)
        const target = this.oldCameraPosition.addScaledVector(movementDirection, 1)
        this.camera.position.lerp(target, 0.2)
    }


    private initDefaults = async () => {

        this.environment_scenes = await makeObjectsFromFile(["block.glb"], this.loadingManager);
        this.scene.background = this.backgroundColor
        for (let n = 5; n < 40; n++) {
            const block = makeBlock(randFloat(-n, n), randFloat(-n, n), randFloat(-n, n), this.blockColors[Math.floor(Math.random() * this.blockColors.length)])
            this.scene.add(block); // Add the block to the scene
            const newMixer = new THREE.AnimationMixer(block)
            let randomVectors
            if (n % 2 == 0) {
                randomVectors = [0, 0, 0, 0, randFloat(-n, n), 0, 0, 0, 0]
            } else {
                randomVectors = [0, 0, 0, 0, 0, randFloat(-n, n), 0, 0, 0]
            }
            let vectorKeyframeTrack = [new THREE.VectorKeyframeTrack("track.position" + n, [0, 5, 10], randomVectors)]
            const animationClip = new THREE.AnimationClip("Action" + n, 10, vectorKeyframeTrack)
            const action = newMixer.clipAction(animationClip)
            action.loop = THREE.LoopRepeat
            action.play()
            this.envBlocks.push(block)
            this.vectorKeyframeTracks.push(vectorKeyframeTrack)
            this.AnimationMixers.push(newMixer)
            this.AnimationActions.push(action)
            this.AnimationClips.push(animationClip)

        }
        // console.log("amount actions", this.AnimationActions)
        // console.log("amoung mixers", this.AnimationMixers)
        // console.log("amount tracks", this.vectorKeyframeTracks)
        this.scene.add(this.character.light, this.character.sphere, ...this.environment_scenes, this.ambientLight);
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
        this.orbitcontrols = new OrbitControls(this.camera, this.renderer.domElement);
    }


    private animate = (time: number) => {

        this.AnimationMixers.forEach((mixer) => mixer.update(this.clock.getDelta() / mixer.timeScale))
        // update the picking ray with the camera and pointer position
        this.update(time)
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate);
    }

    private update(t: number) {
        this.changeMovementState()
        t += 0.01
    }

    static create = (uiEl: HTMLElement) => {
        return new SceneController(uiEl);
    }


}


