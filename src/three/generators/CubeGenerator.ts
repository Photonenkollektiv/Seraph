import { BoxGeometry, Mesh, MeshStandardMaterial } from "three";
import { BaseGenerator } from "./BaseGenerator";

export class CubeGenerator implements BaseGenerator {
    meshes: THREE.Mesh[] = []

    constructor(
        private readonly parentScene: THREE.Scene,
        private readonly width: number = 16,
        private readonly height: number = 10
    ) {
        this.generate()
    }

    generate() {
        for (let i = -this.width; i <= this.width; i += 2) {
            for (let j = -this.height; j <= this.height; j += 2) {
                const geometry = new BoxGeometry(1, 1, 1)
                const material = new MeshStandardMaterial({
                    color: 0x0000ff, // Base color of the material
                    emissive: 0x0000ff, // Emissive color (blue in this case)
                    emissiveIntensity: 1,
                })
                const cube = new Mesh(geometry, material)
                cube.position.set(j, i, 0)
                this.meshes.push(cube)
                this.parentScene.add(cube)
            }
        }
    }
}