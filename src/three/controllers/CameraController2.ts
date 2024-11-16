import * as THREE from 'three';

class CameraController2 {
    private camera: THREE.PerspectiveCamera;
    private domElement: HTMLElement;
    private speed: number;
    private rotationSpeed: number;
    private keys: { [key: string]: boolean } = {};
    private orientationCube!: THREE.Mesh;
    private orientationCamera!: THREE.OrthographicCamera;
    private orientationScene!: THREE.Scene;
    private orientationRenderer!: THREE.WebGLRenderer;

    constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement, speed: number = 0.1, rotationSpeed: number = 0.005) {
        this.camera = camera;
        this.domElement = domElement;
        this.speed = speed;
        this.rotationSpeed = rotationSpeed;

        this.initEventListeners();
        this.initOrientationCube();
    }

    private initEventListeners() {
        this.domElement.addEventListener('keydown', this.onKeyDown.bind(this));
        this.domElement.addEventListener('keyup', this.onKeyUp.bind(this));
        this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    private onKeyDown(event: KeyboardEvent) {
        this.keys[event.code] = true;
    }

    private onKeyUp(event: KeyboardEvent) {
        this.keys[event.code] = false;
    }

    private onMouseMove(event: MouseEvent) {
        if (event.buttons !== 1) return; // Only execute if left mouse button is pressed

        const movementX = event.movementX || 0;
        const movementY = event.movementY || 0;

        this.camera.rotation.y -= movementX * this.rotationSpeed;
        this.camera.rotation.x -= movementY * this.rotationSpeed;
        // this.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.camera.rotation.x)); // Limit vertical rotation
        console.log("Rotation", this.camera.rotation);
    }

    private initOrientationCube() {
        this.orientationScene = new THREE.Scene();
        const size = 50;

        this.orientationCamera = new THREE.OrthographicCamera(-size, size, size, -size, 0.1, 1000);
        this.orientationCamera.position.set(200, 200, 200);
        this.orientationCamera.lookAt(new THREE.Vector3(0, 0, 0));

        const geometry = new THREE.BoxGeometry(50, 50, 50);
        const materials = [
            new THREE.MeshBasicMaterial({ map: this.createLabelTexture('Right', "#C4CBCA") }), // Right
            new THREE.MeshBasicMaterial({ map: this.createLabelTexture('Left', "#C4CBCA") }), // Left
            new THREE.MeshBasicMaterial({ map: this.createLabelTexture('Top', "#3CBBB1") }), // Top
            new THREE.MeshBasicMaterial({ map: this.createLabelTexture('Bottom', "#3CBBB1") }), // Bottom
            new THREE.MeshBasicMaterial({ map: this.createLabelTexture('Front', "#EE4266") }), // Front
            new THREE.MeshBasicMaterial({ map: this.createLabelTexture('Back', "#2A1E5C") }), // Back
        ];
        this.orientationCube = new THREE.Mesh(geometry, materials);
        this.orientationScene.add(this.orientationCube);

        this.orientationRenderer = new THREE.WebGLRenderer({ alpha: true });
        this.orientationRenderer.setSize(150, 150);
        this.orientationRenderer.domElement.style.position = 'absolute';
        this.orientationRenderer.domElement.style.top = '10px';
        this.orientationRenderer.domElement.style.right = '10px';
        this.domElement.appendChild(this.orientationRenderer.domElement);
    }

    private createLabelTexture(text: string, color: string): THREE.Texture {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        if (context) {
            context.fillStyle = color;
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.font = '70px Arial';
            context.fillStyle = '#000000';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(text, canvas.width / 2, canvas.height / 2);
        }
        return new THREE.CanvasTexture(canvas);
    }

    public update() {
        if (this.keys['KeyW']) {
            this.camera.position.add(this.camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(this.speed));
        }
        if (this.keys['KeyS']) {
            this.camera.position.add(this.camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(-this.speed));
        }
        if (this.keys['KeyA']) {
            this.camera.position.add(this.camera.getWorldDirection(new THREE.Vector3()).cross(this.camera.up).multiplyScalar(-this.speed));
        }
        if (this.keys['KeyD']) {
            this.camera.position.add(this.camera.getWorldDirection(new THREE.Vector3()).cross(this.camera.up).multiplyScalar(this.speed));
        }
        if (this.keys['Space']) {
            this.camera.position.add(this.camera.up.multiplyScalar(this.speed));
        }
        if (this.keys['ShiftLeft']) {
            this.camera.position.add(this.camera.up.multiplyScalar(-this.speed));
        }

        // Update orientation cube
        this.orientationCube.quaternion.copy(this.camera.quaternion);
        this.orientationRenderer.render(this.orientationScene, this.orientationCamera);
    }

    public focusOn(object: THREE.Mesh) {
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3()).length();
        const direction = this.camera.position.clone().sub(center).normalize();
        const offset = direction.clone().multiplyScalar(size * 1.5);
        this.camera.position.copy(center).add(offset);
        this.camera.lookAt(center);
        console.log("Rotation", this.camera.rotation);
    }
}

export default CameraController2;
