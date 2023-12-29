import { Box, Paper, Stack, Typography } from '@mui/material';
import { debounce } from 'lodash';
import React, { useCallback, useState } from 'react';

const PIXEL_SIZE = 50;

export interface PixelData {
    color: string;
    address?: number;
    universe?: number;
}

export interface PixelGridProps {
    gridSizeX: number;
    gridSizeY: number;
    pixels: (PixelData | undefined)[][];
}

const getColorOrDefault = (pixelData: (PixelData | undefined)[][], x: number, y: number) => {
    if (!pixelData) {
        return "#424242";
    }
    if (Array.isArray(pixelData) && pixelData.length <= y) {
        return "#424242";
    }
    if (Array.isArray(pixelData[y]) && pixelData[y].length <= x) {
        return "#424242";
    }
    try {
        const pixel = pixelData[y][x];
        if (pixel) {
            return pixel.color;
        }
    } catch (error) {
        //
    }
    return "#424242";
}

export const getAddressAndUniverseOrNothing = (pixelData: (PixelData | undefined)[][], x: number, y: number) => {
    if (!pixelData) {
        return "";
    }
    if (Array.isArray(pixelData) && pixelData.length <= y) {
        return "";
    }
    if (Array.isArray(pixelData[y]) && pixelData[y].length <= x) {
        return "";
    }
    try {
        const pixel = pixelData[y][x];
        if (pixel) {
            return `${pixel.universe}@${pixel.address}`;
        }
    } catch (error) {
        //
    }
    return "";
}

type HoverDataType = {
    address: number;
    universe: number;
    top: number;
    left: number;
}

const PixelsForGrid = ({ gridSizeX, gridSizeY, pixels, setHoverData }: PixelGridProps & { setHoverData: (data: HoverDataType | undefined) => void }) => {
    return (<Stack key={`grid-container`} direction={"column"} spacing={0}>
        <Stack key={`y-ruler`} direction={"row"} spacing={0} sx={{ marginBottom: 3, paddingLeft: 8 }}>
            {Array.from({ length: gridSizeX }, (_, x) => {
                return (<Typography key={`y-${x}-ruler`} variant='h6' style={{ width: PIXEL_SIZE, height: 20 }}>{x}</Typography>)
            })}
        </Stack>
        {Array.from({ length: gridSizeY }, (_, y) => (
            <Stack key={`${y}-x-stack`} direction={"row"} spacing={0}>
                <Typography key={`${y}-x-ruler`} variant='h6' style={{ width: 20, height: PIXEL_SIZE }} sx={{ paddingRight: 2, paddingLeft: 2 }}>{y}</Typography>
                {Array.from({ length: gridSizeX }, (_, x) => {
                    const color = getColorOrDefault(pixels, x, y);
                    const addressAndUniverse = getAddressAndUniverseOrNothing(pixels, x, y);
                    return (
                        // <Tooltip title={`${addressAndUniverse}`}>
                        <div
                            key={`${x}-${y}-item`}
                            onMouseOver={(e) => {
                                if (!addressAndUniverse || addressAndUniverse === "") {
                                    setHoverData(undefined);
                                    return;
                                }
                                // get position of current pixel
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = rect.left + window.scrollX;
                                const y = rect.top + window.scrollY;

                                setHoverData({
                                    address: parseInt(addressAndUniverse.split("@")[1]),
                                    universe: parseInt(addressAndUniverse.split("@")[0]),
                                    top: y + (PIXEL_SIZE * 0.75),
                                    left: x + (PIXEL_SIZE * 0.75)
                                })
                            }}
                            style={{
                                width: PIXEL_SIZE,
                                height: PIXEL_SIZE,
                                backgroundColor: color,
                                border: "1px solid black"
                            }}></div>
                        // </Tooltip>
                    )
                })}
            </Stack>
        ))}
    </Stack>)
}

const HoverOverlay = ({ hoverData }: { hoverData: HoverDataType | undefined }) => {
    return (<>
        {hoverData ? <Paper sx={{ position: "absolute", top: hoverData.top, left: hoverData.left,padding: 1}}>
            <Typography variant="overline">Universe: {hoverData.universe}</Typography>
            <br />
            <Typography variant="overline">Address: {hoverData.address}</Typography>
        </Paper> : null}
    </>)
}

const PixelGrid: React.FC<PixelGridProps> = ({ gridSizeX, gridSizeY, pixels }) => {
    const [hoverData, setHoverData] = useState<HoverDataType | undefined>();
    const debouncedSetHoverData = useCallback(debounce((data: HoverDataType | undefined) => {
        console.log("Setting hover data", data);
        setHoverData(data);
    }, 10), [setHoverData]);

    return (
        <div onMouseLeave={() => setHoverData(undefined)} style={{ backgroundColor: "#424242", overflow: "scroll", maxHeight: "96vh", height: "96vh" }}>
            <Box sx={{
                width: PIXEL_SIZE * gridSizeX + 20,
                height: PIXEL_SIZE * gridSizeY + 20,
                backgroundColor: "#424242",
            }}>
                <PixelsForGrid setHoverData={debouncedSetHoverData} gridSizeX={gridSizeX} gridSizeY={gridSizeY} pixels={pixels} />
            </Box>
            <HoverOverlay hoverData={hoverData} />
        </div >
    )
};

export default PixelGrid;
