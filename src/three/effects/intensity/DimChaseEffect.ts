import { Mesh, MeshStandardMaterial } from "three";
import { BaseIntensityEffect } from "./BaseIntensityEffect";

export class DimChaseEffect implements BaseIntensityEffect {

    private lastBeatTime: number = 0


    update(meshes: Mesh[], time: number, bpm: number, beat: boolean): void {
        if (beat) {
            this.lastBeatTime = time
        }


        const progression = (time - this.lastBeatTime) / ((60000) / bpm)
        meshes.forEach((mesh, index) => {
            const materialsToEdit = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
            const dim = Math.sin(progression * 2 * Math.PI + (index * 0.05)) * 0.9 - 0.4
            materialsToEdit.forEach(material => {
                (material as MeshStandardMaterial).emissiveIntensity = dim
            });
        })
    }
}