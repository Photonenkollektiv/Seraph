import { BoxGeometry, Mesh, MeshStandardMaterial, Scene } from "three";
import { BaseGenerator } from "./BaseGenerator";

export class LineGenerator implements BaseGenerator {
    meshes: THREE.Mesh[] = []

    constructor(
        private readonly parentScene: Scene,
        private readonly amount: number = 20
    ) {
        this.generate()
    }

    generate() {
        const start = -this.amount
        const end = this.amount
        const step = 4
        for (let i = start; i <= end; i += step) {
            const geometry = new BoxGeometry(1, 1, 1)
            const material = new MeshStandardMaterial({ color: "#FCA311" })
            const cube = new Mesh(geometry, material)
            cube.position.set(0, i, 0)
            this.meshes.push(cube)
            this.parentScene.add(cube)
        }
    }
}