import * as THREE from 'three';
import { BaseFixture } from './BaseFixture';

interface LEDStripOptions {
    pixelsPerMeter: number;
    lengthInMeter: number;
    startPosition: THREE.Vector3;
    direction: THREE.Euler; // roll, yaw, pitch
}

class LEDStrip extends BaseFixture {
    private pixelsPerMeter: number;
    private lengthInMeter: number;
    private startPosition: THREE.Vector3;
    private direction: THREE.Euler;
    private scene: THREE.Scene;
    private cubes: THREE.Mesh[];

    constructor(options: LEDStripOptions, scene: THREE.Scene) {
        super();
        this.pixelsPerMeter = options.pixelsPerMeter;
        this.lengthInMeter = options.lengthInMeter;
        this.startPosition = options.startPosition;
        this.direction = options.direction;
        this.scene = scene;
        this.cubes = [];

        this.createLEDStrip();
    }

    private createLEDStrip() {
        const pixelCount = this.pixelsPerMeter * this.lengthInMeter;
        const cubeSize = 0.01; // 30mm in meters
        const spacing = this.lengthInMeter / (pixelCount - 1); // Spacing between each pixel

        const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

        for (let i = 0; i < pixelCount; i++) {
            const cube = new THREE.Mesh(geometry, material);

            // Calculate position
            const position = new THREE.Vector3(
                this.startPosition.x + i * spacing,
                this.startPosition.y,
                this.startPosition.z
            );

            // Apply direction (rotation)
            cube.position.copy(position);
            cube.rotation.copy(this.direction);

            this.cubes.push(cube);
            this.scene.add(cube);
        }
    }

    private clearLEDStrip() {
        this.cubes.forEach((cube) => {
            this.scene.remove(cube);
        });
        this.cubes = [];
    }

    public changePosition(position: THREE.Vector3): void {
        this.startPosition = position;
        this.cubes.forEach((cube, i) => {
            const spacing = this.lengthInMeter / (this.cubes.length - 1);
            cube.position.set(
                this.startPosition.x + i * spacing,
                this.startPosition.y,
                this.startPosition.z
            );
        });
    }

    public getPosition(): THREE.Vector3 {
        return this.startPosition;
    }

    public changeRotation(rotation: THREE.Euler): void {
        this.direction = rotation;
        this.cubes.forEach((cube) => {
            cube.rotation.copy(this.direction);
        });
    }

    public getRotation(): THREE.Euler {
        return this.direction;
    }

    public changePixelCount(pixelCount: number): void {
        this.cubes.forEach((cube) => {
            this.scene.remove(cube);
        });
        this.cubes = [];
        this.pixelsPerMeter = pixelCount;
        this.clearLEDStrip();
        this.createLEDStrip();
    }

    public changeLength(length: number): void {
        this.cubes.forEach((cube) => {
            this.scene.remove(cube);
        });
        this.cubes = [];
        this.lengthInMeter = length;
        this.clearLEDStrip();
        this.createLEDStrip();
    }

    public destroy(): void {
        this.clearLEDStrip();
    }

    public getBorderMesh(): THREE.Mesh {

        const meshStartPositon = new THREE.Vector3(
            this.startPosition.x - 0.01,
            this.startPosition.y - 0.01,
            this.startPosition.z - 0.01
        );
        const endMeshElement = this.cubes[this.cubes.length - 1];
        const meshEndPosition = new THREE.Vector3(
            endMeshElement.position.x + 0.01,
            endMeshElement.position.y + 0.01,
            endMeshElement.position.z + 0.01
        );

        const geometry = new THREE.BoxGeometry(
            meshEndPosition.x - meshStartPositon.x,
            meshEndPosition.y - meshStartPositon.y,
            meshEndPosition.z - meshStartPositon.z
        );
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const borderMesh = new THREE.Mesh(geometry, material);
        borderMesh.position.copy(meshStartPositon);
        return borderMesh;

    }
}

export default LEDStrip;
