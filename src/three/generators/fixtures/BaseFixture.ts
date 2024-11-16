export abstract class BaseFixture {
    public name: string = "BaseFixture";
    public dmxAddress: number = 1;
    public universe: number = 1;

    constructor() {}

    public setDMXAddress(address: number) {
        this.dmxAddress = address;
    }

    public setUniverse(universe: number) {
        this.universe = universe;
    }

    public setName(name: string) {
        console.log("Setting name to: ", name);
        this.name = name;
    }

    abstract destroy(): void;

    abstract getPosition(): THREE.Vector3;

    abstract changePosition(position: THREE.Vector3): void;

    abstract getRotation(): THREE.Euler;

    abstract changeRotation(rotation: THREE.Euler): void;

    abstract changePixelCount(pixelCount: number): void;

    abstract changeLength(length: number): void;

    abstract getBorderMesh(): THREE.Mesh;
   
}