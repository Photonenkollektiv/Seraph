export abstract class BaseFixture {
    public name: string = "BaseFixture";
    public dmxAddress: number = 1;
    public universe: number = 1;

    constructor() {}

    abstract destroy(): void;
   
}