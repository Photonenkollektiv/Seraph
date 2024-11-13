import { Mesh } from "three";

export abstract class BasePositionEffect {
    protected constructor() {
    }
    public abstract animate(meshes: Mesh[], time: number): void;
}