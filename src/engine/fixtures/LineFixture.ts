import { z } from "zod";
import { BaseFixture, UIElement } from "./BaseFixture";

interface Point {
    x: number;
    y: number;
}

function getPointsInDirection(startpunkt: Point, winkel: number, anzahl: number): Point[] {

    const punkte = [startpunkt];
    let { x, y } = startpunkt;

    // Stelle sicher, dass der Winkel zwischen 0 und 360 Grad liegt
    winkel = winkel % 360;

    let dx = anzahl * Math.cos(winkel * Math.PI / 180);
    let dy = anzahl * Math.sin(winkel * Math.PI / 180);
    const d = Math.max(Math.abs(dx), Math.abs(dy));
    dx = dx / d;
    dy = dy / d;

    for (let i = 0; i < anzahl - 1; i++) {
        x += dx;
        y += dy;
        punkte.push({ x: Math.round(x), y: Math.round(y) });
    }

    return punkte;
}

export class LineFixture extends BaseFixture implements BaseFixture {
    public readonly fixtureName = "Line";
    public readonly description = "A simple line";
    public readonly version = "0.0.1";

    public constructor(instanceNameSuffix?: string) {
        super(`Line-${instanceNameSuffix}`);
    }

    private state = {
        x1: 0,
        y1: 0,
        angle: 0,
        length: 5,
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
    },{
        type: "boolean",
        fieldLabel: "Reverse",
        fieldStateName: "reverse",
    }] satisfies UIElement[]);

    public getStateData = () => this.state;

    public setStateForKey = (key: string, data: string | number | boolean) => {
        if(key === "reverse"){
            this.reverse = data as boolean;
            return;
        }
        if (!Object.keys(this.state).includes(key)) throw new Error(`Key ${key} does not exist in state`);
        // @ts-expect-error wtf
        this.state[key] = data;
    };

    public getPixelMap = () => {
        const { x1, y1, angle, length } = this.state;
        const points = getPointsInDirection({ x: x1, y: y1 }, angle, length);
        return points;
    }

    public clone = (): LineFixture => {
        const newFixture = new LineFixture();
        newFixture.state = { ...this.state };
        newFixture.instanceName = this.instanceName + " (copy)";
        newFixture.dmxGroup = this.dmxGroup;
        newFixture.dmxGroupOrder = this.dmxGroupOrder + 1;
        return newFixture;
    }

    public toJSON = (): object => {
        const objectForJson = {
            type: "LineFixture",
            instanceName: this.instanceName,
            dmxGroup: this.dmxGroup,
            dmxGroupOrder: this.dmxGroupOrder,
            state: this.state,
        }
        return objectForJson;
    }

    public static fromJSON = (jsonFixture: unknown): LineFixture => {
        const savedLineFixtureSchema = z.object({
            type: z.literal("LineFixture"),
            instanceName: z.string(),
            dmxGroup: z.string(),
            dmxGroupOrder: z.number(),
            state: z.object({
                x1: z.number(),
                y1: z.number(),
                angle: z.number(),
                length: z.number(),
            })
        })

        const { instanceName, dmxGroup, dmxGroupOrder, state } = savedLineFixtureSchema.parse(jsonFixture);
        const lineFixture = new LineFixture();
        lineFixture.instanceName = instanceName;
        lineFixture.dmxGroup = dmxGroup;
        lineFixture.dmxGroupOrder = dmxGroupOrder;
        lineFixture.state = state;
        return lineFixture;

    }
}