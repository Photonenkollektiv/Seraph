import { BaseFixture, PixelMapItem, UIElement } from "./BaseFixture";

function getPointsInDirection(start: { x: number, y: number }, angle: number, distance: number): PixelMapItem[] {
    // Convert angle to radians
    const angleInRadians = (angle * Math.PI) / 180;

    // Calculate new point coordinates
    const deltaX = distance * Math.cos(angleInRadians);
    const deltaY = distance * Math.sin(angleInRadians);

    // Calculate the number of points along the direction
    const numberOfPoints = Math.ceil(distance);

    // Generate an array of points
    const points: { x: number, y: number }[] = [];
    for (let i = 0; i < numberOfPoints; i++) {
        const x = Math.round(start.x + i * (deltaX / numberOfPoints));
        const y = Math.round(start.y + i * (deltaY / numberOfPoints));
        points.push({ x, y });
    }

    return points;
}


export class LineFixture extends BaseFixture implements BaseFixture {
    public readonly fixtureName = "Line";
    public readonly description = "A simple line";
    public readonly version = "0.0.1";

    private state = {
        x1: 0,
        y1: 0,
        angle: 0,
        length: 0,
    }


    public getUISchema = () => ([{
        type: "heading",
        fieldLabel: "Line Settings",
        fieldStateName: "line",
        subTitle: "A simple line",
    }, {
        type: "number",
        fieldLabel: "X1",
        fieldStateName: "x1",
    }, {
        type: "number",
        fieldLabel: "Y1",
        fieldStateName: "y1",
    }, {
        type: "number",
        fieldLabel: "Angle",
        fieldStateName: "angle",
    }, {
        type: "number",
        fieldLabel: "Length",
        fieldStateName: "length",
    }] satisfies UIElement[]);

    public getStateData = () => this.state;

    public setStateForKey = (key: string, data: string | number | boolean) => {
        if (!Object.keys(this.state).includes(key)) throw new Error(`Key ${key} does not exist in state`);
        // @ts-expect-error wtf
        this.state[key] = data;
    };

    public getPixelMap = () => {
        const { x1, y1, angle, length } = this.state;
        const points = getPointsInDirection({ x: x1, y: y1 }, angle, length);

        return points;
    }
}