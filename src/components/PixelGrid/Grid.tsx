import { Box, Stack, Typography } from '@mui/material';
import React from 'react';

const PIXEL_SIZE = 50;

export interface PixelData {
    color: string;
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

const PixelGrid: React.FC<PixelGridProps> = ({ gridSizeX, gridSizeY, pixels }) => {
    const PixelsForGrid = () => {
        return (<Stack direction={"column"} spacing={0}>
            <Stack direction={"row"} spacing={0} sx={{ marginBottom: 3, paddingLeft: 8 }}>
                {Array.from({ length: gridSizeX }, (_, x) => {
                    return (<Typography variant='h6' style={{ width: PIXEL_SIZE, height: 20 }}>{x}</Typography>)
                })}
            </Stack>
            {Array.from({ length: gridSizeY }, (_, y) => (
                <Stack direction={"row"} spacing={0}>
                    <Typography variant='h6' style={{ width: 20, height: PIXEL_SIZE }} sx={{ paddingRight: 2, paddingLeft: 2 }}>{y}</Typography>
                    {Array.from({ length: gridSizeX }, (_, x) => {
                        const color = getColorOrDefault(pixels, x, y);
                        return (<div style={{
                            width: PIXEL_SIZE,
                            height: PIXEL_SIZE,
                            backgroundColor: color,
                            border: "1px solid black"
                        }}></div>)
                    })}
                </Stack>
            ))}
        </Stack>)
    }
    console.log("Rendering grid");
    return (
        <div style={{ backgroundColor: "#424242", overflow: "scroll", maxHeight: "96vh", height: "96vh" }}>
            <Box sx={{
                width: PIXEL_SIZE * gridSizeX + 20,
                height: PIXEL_SIZE * gridSizeY + 20,
                backgroundColor: "#424242",
            }}>
                <PixelsForGrid />
            </Box>
        </div >
    )
};

export default PixelGrid;
