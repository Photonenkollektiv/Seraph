
export type UIElement = {
    type: "number" | "string" | "boolean" | "heading";
    fieldLabel: string;
    fieldStateName: string;
    fieldDescription?: string;
    subTitle?: string;
}

export type PixelMapItem = {
    x: number;
    y: number;
}

export type PixelMapItemWithAddressing = {
    universe: number;
    address: number;
    originInstanceName: string;
    pixelIdx: string;
    x: number;
    y: number;
};

export type StateTypes = string | number | boolean

export type StateData = {
    [key: string]: StateTypes
}

const generateUUID = (): string => {
    const s4 = (): string => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return `${s4()}-${s4()}-${s4()}-${s4()}`;
}
export abstract class BaseFixture {
    public abstract readonly fixtureName: string;
    public abstract readonly description: string;
    public abstract readonly version: string;
    public readonly instanceUUID: string;
    public instanceName: string = "";
    public dmxGroup: string = "Default";
    public dmxGroupOrder: number = 0;

    public constructor(instanceName?: string) {
        this.instanceUUID = generateUUID();
        if (instanceName)
            this.instanceName = instanceName;
    }

    public abstract getUISchema: () => UIElement[];
    public abstract getStateData: () => StateData
    public abstract setStateForKey: (key: string, data: StateTypes) => void;
    public abstract getPixelMap: () => PixelMapItem[];
    public abstract clone: () => BaseFixture;
    public abstract toJSON: () => string | object;
    public getPixelMapWithAdresses = (universe: number, startAddress: number, renderingOverallOrder?: number): PixelMapItemWithAddressing[] => {
        const points = this.getPixelMap();
        return points.map((point, index) => {
            const address = startAddress + (index * 3);
            const universeSize = 170 * 3; // 170 pixels, each pixel needs 3 addresses
            const universeAddress = address % universeSize;
            const universeNumber = Math.floor(address / universeSize);

            return {
                ...point,
                universe: universe + universeNumber,
                address: universeAddress,
                originInstanceName: this.instanceName,
                pixelIdx: `${renderingOverallOrder && renderingOverallOrder + "-"}${index}`,
            } satisfies PixelMapItemWithAddressing;
        });
    }
    public setDMXGroup = (group: string) => {
        this.dmxGroup = group;
    }
    public setDMXGroupOrder = (order: number) => {
        this.dmxGroupOrder = order;
    }
    public setInstanceName = (name: string) => {
        this.instanceName = name;
    }
}
