import * as THREE from 'three';

class WorldGrid {
  private size: number;
  private divisions: number;
  private grid: THREE.Group;

  constructor(size: number, divisions: number) {
    this.size = size;
    this.divisions = divisions;
    this.grid = new THREE.Group();

    this.createGrid();
  }

  private createGrid(): void {
    const gridHelper = new THREE.GridHelper(this.size, this.divisions);
    this.grid.add(gridHelper);

    // Draw lines on each whole coordinate in all three dimensions
    for (let i = -this.size / 2; i <= this.size / 2; i += this.size / this.divisions) {
      for (let j = -this.size / 2; j <= this.size / 2; j += this.size / this.divisions) {
        this.drawLine(i, -this.size / 2, j, i, this.size / 2, j); // Y-axis lines
        this.drawLine(i, j, -this.size / 2, i, j, this.size / 2); // Z-axis lines
        this.drawLine(-this.size / 2, i, j, this.size / 2, i, j); // X-axis lines
      }
    }
  }

  private drawLine(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): void {
    const material = new THREE.LineBasicMaterial({ color: new THREE.Color("#ffffff") });
    const points: THREE.Vector3[] = [];
    points.push(new THREE.Vector3(x1, y1, z1));
    points.push(new THREE.Vector3(x2, y2, z2));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    this.grid.add(line);
  }

  public getGrid(): THREE.Group {
    return this.grid;
  }

  public toggleVisibility(visible:boolean): void {
    this.grid.visible = visible;
  }
}

export default WorldGrid;
