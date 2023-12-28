import { PixelData } from "../components/PixelGrid/Grid";
import { PixelMapItem } from "./fixtures/BaseFixture";

export type pixelMapsToArrayProps = {
    pixelMaps: PixelMapItem[];
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
        }
    })
    return pixelData;
}