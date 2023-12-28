import { AppBar, Box, Button, Grid, Toolbar, Typography } from "@mui/material"
import PixelGrid, { PixelData } from "./PixelGrid/Grid"
import { BaseFixture } from "../engine/fixtures/BaseFixture";
import { useEffect, useState } from "react";
import { FixtureList } from "./FixtureList";
import { LineFixture } from "../engine/fixtures/LineFixture";
import * as _ from "lodash";
import { pixelMapsToArray } from "../engine/EngineService";
const gridSizeX = 200;
const gridSizeY = 200;

const pixels: PixelData[][] = Array.from({ length: gridSizeY }, () =>
    Array.from({ length: gridSizeX }, () => ({
        color: Math.random() > 0.5 ? '#000000' : '#FFFFFF', // Example: Random black or white color
    }))
);

export const Editor = () => {

    const [fixtures, setFixtures] = useState<BaseFixture[]>([
        new LineFixture()
    ]);

    const [pixelData, setPixelData] = useState<PixelData[][]>([]);

    const reRenderHook = _.debounce(() => {
        try {
            console.log("Re-rendering")
            console.log(fixtures);
            const pixelMaps = fixtures.flatMap((fixture) => {
                return fixture.getPixelMap();
            });
            console.log("Maps: ", pixelMaps)
            const pixelData = pixelMapsToArray({
                pixelMaps,
                gridSizeX,
                gridSizeY
            });
            console.log(pixelData);
            setPixelData(pixelData);
            console.log("Re-rendered")
        } catch (e) {
            console.error(e);
        }
    }, 500)

    return (
        <Box>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit" component="div">
                        Seraph
                    </Typography>
                </Toolbar>
            </AppBar>
            <Button onClick={() => {
                setPixelData(reRenderHook);
            }
            }>rE rENDER</Button>
            <Grid container>
                <Grid item xs={4}>
                    <Typography variant="h6">
                        <FixtureList reRenderHook={reRenderHook} fixtures={fixtures} />
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <Typography variant="h6" color="inherit">
                        <PixelGrid gridSizeX={gridSizeX} gridSizeY={gridSizeY} pixels={pixelData} />
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    )
}