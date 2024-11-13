import * as THREE from 'three';

class OrbitalCameraController {
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private target: THREE.Vector3;
    private distance: number;
    private azimuthalAngle: number;
    private polarAngle: number;
    private minPolarAngle: number;
    private maxPolarAngle: number;
    private minDistance: number;
    private maxDistance: number;
    private zoomSpeed: number;
    private rotateSpeed: number;
    private movementSpeed: number;
    private keys: { forward: boolean; backward: boolean; left: boolean; right: boolean };
    private uiEl: HTMLElement;

    constructor(renderer: THREE.WebGLRenderer, uiEle: HTMLElement, target: THREE.Vector3 = new THREE.Vector3(0, 0, 0)) {
        this.camera = new THREE.PerspectiveCamera(110, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 1.6, 5);

        this.renderer = renderer;
        this.target = target;
        this.distance = 2;
        this.azimuthalAngle = 0;
        this.polarAngle = Math.PI / 2;
        this.minPolarAngle = 0;
        this.maxPolarAngle = Math.PI;
        this.minDistance = 0.01;
        this.maxDistance = 25;
        this.zoomSpeed = 1.0;
        this.rotateSpeed = 0.005;
        this.movementSpeed = 0.02;
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false
        };
        this.uiEl = uiEle;
        this.uiEl.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        this.uiEl.addEventListener('wheel', this.onMouseWheel.bind(this), false);
        this.uiEl.addEventListener('mousedown', this.onMouseDown.bind(this), false);
        this.uiEl.addEventListener('mouseup', this.onMouseUp.bind(this), false);
        this.uiEl.addEventListener('keydown', this.onKeyDown.bind(this), false);
        this.uiEl.addEventListener('keyup', this.onKeyUp.bind(this), false);

        this.updateCameraPosition();
    }

    private isMouseDown: boolean = false;
    private onMouseDownPosition: { x: number; y: number } = { x: 0, y: 0 };

    private onMouseMove(event: MouseEvent): void {
        if (this.isMouseDown) {
            const movementX = event.movementX || 0;
            const movementY = event.movementY || 0;

            this.azimuthalAngle -= movementX * this.rotateSpeed;
            this.polarAngle -= movementY * this.rotateSpeed;

            this.polarAngle = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.polarAngle));

            this.updateCameraPosition();
        }
    }

    private onMouseDown(event: MouseEvent): void {
        this.isMouseDown = true;
        this.onMouseDownPosition.x = event.clientX;
        this.onMouseDownPosition.y = event.clientY;
    }

    private onMouseUp(event: MouseEvent): void {
        this.isMouseDown = false;
    }

    private onMouseWheel(event: WheelEvent): void {
        this.distance += event.deltaY * this.zoomSpeed * 0.01;
        this.distance = Math.max(this.minDistance, Math.min(this.maxDistance, this.distance));
        this.updateCameraPosition();
    }

    private onKeyDown(event: KeyboardEvent): void {
        switch (event.code) {
            case 'KeyW':
                this.keys.forward = true;
                break;
            case 'KeyS':
                this.keys.backward = true;
                break;
            case 'KeyA':
                this.keys.left = true;
                break;
            case 'KeyD':
                this.keys.right = true;
                break;
        }
    }

    private onKeyUp(event: KeyboardEvent): void {
        switch (event.code) {
            case 'KeyW':
                this.keys.forward = false;
                break;
            case 'KeyS':
                this.keys.backward = false;
                break;
            case 'KeyA':
                this.keys.left = false;
                break;
            case 'KeyD':
                this.keys.right = false;
                break;
        }
    }

    private updateCameraPosition(): void {
        const x = this.distance * Math.sin(this.polarAngle) * Math.cos(this.azimuthalAngle);
        const y = this.distance * Math.cos(this.polarAngle);
        const z = this.distance * Math.sin(this.polarAngle) * Math.sin(this.azimuthalAngle);

        this.camera.position.set(x, y, z);
        this.camera.lookAt(this.target);
    }

    public update(): void {
        const direction = new THREE.Vector3();
        const right = new THREE.Vector3();
        const forward = new THREE.Vector3();

        this.camera.getWorldDirection(direction);
        right.crossVectors(this.camera.up, direction).normalize();
        forward.crossVectors(right, this.camera.up).normalize();

        if (this.keys.forward) {
            this.target.add(forward.multiplyScalar(this.movementSpeed));
        }
        if (this.keys.backward) {
            this.target.add(forward.multiplyScalar(-this.movementSpeed));
        }
        if (this.keys.left) {
            this.target.add(right.multiplyScalar(-this.movementSpeed));
        }
        if (this.keys.right) {
            this.target.add(right.multiplyScalar(this.movementSpeed));
        }

        this.updateCameraPosition();
    }

    public getCamera(): THREE.PerspectiveCamera {
        return this.camera;
    }

    public remountEventListeners(): void {
        this.uiEl.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        this.uiEl.addEventListener('wheel', this.onMouseWheel.bind(this), false);
        this.uiEl.addEventListener('mousedown', this.onMouseDown.bind(this), false);
        this.uiEl.addEventListener('mouseup', this.onMouseUp.bind(this), false);
        this.uiEl.addEventListener('keydown', this.onKeyDown.bind(this), false);
        this.uiEl.addEventListener('keyup', this.onKeyUp.bind(this), false);
    }
}

export default OrbitalCameraController;
