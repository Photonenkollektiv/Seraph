import { Vector3 } from "three";
import { makeLight, makeSphere } from "./lib/generators"

export class CharacterController {

    public light: THREE.Light;
    public sphere: THREE.Mesh;
    public keepMoving: boolean;
    public position: THREE.Vector3

    public constructor(){
        this.light = makeLight()
        this.sphere = makeSphere()
        this.keepMoving = false;
        this.position = new Vector3(0,0,0.3)
    }
    public changePosition = (target: THREE.Vector3) => {
            this.sphere.position.lerp(target, 0.2)
            this.light.position.lerp(target, 0.2)
    }
    public moveInDirection = (vector: THREE.Vector3) => {
        this.position.copy(this.light.position)
        const target = this.position.addScaledVector(vector, 1)
        this.changePosition(target)
    }
    public changeLightIntensity = (value: number) => {
        this.light.intensity = this.light.intensity + value
    }
}