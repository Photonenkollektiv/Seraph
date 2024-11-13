export abstract class BaseGenerator {

    abstract meshes: THREE.Mesh[];

    protected constructor() {

    }
    public abstract generate(): void;
}