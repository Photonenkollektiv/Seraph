import { Mesh } from "three";

export abstract class BaseIntensityEffect {
    protected constructor() {
    }
    public abstract update(meshes: Mesh[], time: number, bpm: number, beat: boolean): void;
}