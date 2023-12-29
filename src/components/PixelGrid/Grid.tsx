import { Box, Paper, Stack, Typography } from '@mui/material';
import React, { useCallback, useRef, useState } from 'react';
import ZoomWrapper from '../ZoomWrapper';

const PIXEL_SIZE = 20;

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
        <Stack key={`y-ruler`} direction={"row"} spacing={0} sx={{ paddingLeft: 4 }}>
            {Array.from({ length: gridSizeX }, (_, x) => {
                return (<Box key={`y-${x}-ruler`} sx={{ width: PIXEL_SIZE, maxWidth: PIXEL_SIZE, height: (PIXEL_SIZE), backgroundColor: "#1f1f1f" }}>
                    <Typography sx={{ fontSize: "8px", color: "#B2B2B2", paddingLeft: 1 }} variant='body2'>{x}</Typography>
                </Box>)
            })}
        </Stack>
        {Array.from({ length: gridSizeY }, (_, y) => (
            <Stack key={`${y}-x-stack`} direction={"row"} spacing={0}>
                <Box sx={{ paddingRight: 2, paddingLeft: 1, width: (PIXEL_SIZE / 2), height: PIXEL_SIZE, backgroundColor: "#1f1f1f" }}>
                    <Typography key={`${y}-x-ruler`} sx={{ fontSize: "8px", color: "#B2B2B2", paddingTop: 0.7 }} variant='body2' >{y}</Typography>

                </Box>

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
        {hoverData ? <Paper sx={{ position: "absolute", top: hoverData.top, left: hoverData.left, padding: 1 }}>
            <Typography variant="overline">Universe: {hoverData.universe}</Typography>
            <br />
            <Typography variant="overline">Address: {hoverData.address}</Typography>
        </Paper> : null}
    </>)
}

const PixelGrid: React.FC<PixelGridProps> = ({ gridSizeX, gridSizeY, pixels }) => {
    const [hoverData, setHoverData] = useState<HoverDataType | undefined>();
    const innerDivRef = useRef<HTMLDivElement>(null);
    const debouncedSetHoverData = useCallback((data: HoverDataType | undefined) => {
        if (data && data.address && data.universe) {
            setHoverData(data);
        }
    }, [hoverData]);

    return (
        <>
            <div ref={innerDivRef} id="scroll-box" onMouseLeave={() => setHoverData(undefined)} style={{ backgroundColor: "#424242", overflow: "scroll", maxHeight: "94vh", height: "94vh" }}>
                <Box sx={{
                    width: PIXEL_SIZE * gridSizeX + 20,
                    height: PIXEL_SIZE * gridSizeY + 20,
                    backgroundColor: "#424242",
                }}>
                    <ZoomWrapper innerDivRef={innerDivRef}>
                        <PixelsForGrid setHoverData={debouncedSetHoverData} gridSizeX={gridSizeX} gridSizeY={gridSizeY} pixels={pixels} />
                    </ZoomWrapper>
                </Box>
                <HoverOverlay hoverData={hoverData} />
            </div >
            <Paper sx={{ position: "absolute", bottom: "3%", right: "1%", padding: 1, opacity: 0.4 }} elevation={4}>
                <Typography variant="overline">Right-click: Move grid</Typography>
                <br />
                <Typography variant="overline">CTRL+Scroll: Zoom</Typography>
            </Paper>
        </>
    )
};

export default PixelGrid;
