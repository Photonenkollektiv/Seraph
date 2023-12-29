import { PixelData } from "../components/PixelGrid/Grid";
import { BaseFixture, PixelMapItemWithAddressing } from "./fixtures/BaseFixture";

export type pixelMapsToArrayProps = {
    pixelMaps: PixelMapItemWithAddressing[];
    gridSizeX: number;
    gridSizeY: number;
}


export const pixelMapsToArray = (props: pixelMapsToArrayProps): PixelData[][] => {
    const { pixelMaps } = props;
    const pixelData: PixelData[][] = [];
    pixelMaps.forEach((pixelMap) => {
        const { x, y } = pixelMap;
        if (!pixelData[y]) pixelData[y] = [];
        pixelData[y][x] = {
            color: "red",
            universe: pixelMap.universe,
            address: pixelMap.address,
        }
    })
    return pixelData;
}

export const getPixelMapWithAddresses = (fixtures: BaseFixture[]): PixelMapItemWithAddressing[] => {
    const dmxGroups: { [key: string]: BaseFixture[] } = {};
    fixtures.forEach((fixture) => {
        if (!dmxGroups[fixture.dmxGroup]) dmxGroups[fixture.dmxGroup] = [];
        dmxGroups[fixture.dmxGroup].push(fixture);
    })

    let dmxStartUniverse = 1;
    let dmxStartAddress = 1;
    const pixelMaps: PixelMapItemWithAddressing[] = [];

    Object.keys(dmxGroups).forEach((dmxGroup) => {
        const fixtures = dmxGroups[dmxGroup];
        fixtures.sort((a, b) => a.dmxGroupOrder - b.dmxGroupOrder).forEach((fixture) => {
            const pixelMap = fixture.getPixelMapWithAdresses(dmxStartUniverse, dmxStartAddress);
            pixelMaps.push(...pixelMap);
            dmxStartAddress += pixelMap.length * 3;
        })
        dmxStartUniverse++;
    })

    return pixelMaps;
}