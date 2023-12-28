
export type UIElement = {
    type: "number" | "string" | "boolean" | "heading" ;
    fieldLabel: string;
    fieldStateName: string;
    fieldDescription?: string;
    subTitle?: string;
}

export type PixelMapItem = {
    x: number;
    y: number;
}

export type StateTypes = string | number | boolean

export type StateData = {
    [key: string]: StateTypes
}

export abstract class BaseFixture {
    public abstract readonly fixtureName: string;
    public abstract readonly description: string;
    public abstract readonly version: string;
    public instanceName: string = "Line Fixture";
    public dmxGroup: string  = "Default";
    public dmxGroupOrder: number = 0;
    
    public abstract getUISchema: () => UIElement[];
    public abstract getStateData: () => StateData
    public abstract setStateForKey: (key:string, data: StateTypes) => void;
    public abstract getPixelMap: () => PixelMapItem[];
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
