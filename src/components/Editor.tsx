import { AppBar, Box, Button, Grid, Toolbar, Typography } from "@mui/material"
import PixelGrid, { PixelData } from "./PixelGrid/Grid"
import { BaseFixture } from "../engine/fixtures/BaseFixture";
import { useEffect, useState } from "react";
import { FixtureList } from "./FixtureList";
import { LineFixture } from "../engine/fixtures/LineFixture";
import * as _ from "lodash";
import { getPixelMapWithAddresses, pixelMapsToArray } from "../engine/EngineService";
const gridSizeX = 200;
const gridSizeY = 200;

export const Editor = () => {

    const [fixtures, setFixtures] = useState<BaseFixture[]>([
        new LineFixture("1")
    ]);

    const [pixelData, setPixelData] = useState<PixelData[][]>([]);

    const dmxGroupsUnique = [...new Set(fixtures.map((fixture) => {
        return fixture.dmxGroup;
    }))];

    const reRenderHook = _.debounce(() => {
        try {
            console.group("2D Map Calculation")
            console.log("Fixtures to use:", fixtures);
            const pixelMaps = getPixelMapWithAddresses(fixtures);
            const pixelData = pixelMapsToArray({
                pixelMaps,
                gridSizeX,
                gridSizeY
            });
            console.log("Calculated Array: ", pixelData);
            console.groupEnd();
            setPixelData(pixelData);
        } catch (e) {
            console.error(e);
        }
    }, 250)

    useEffect(() => {
        reRenderHook();
    }, [])

    const addNewFixture = () => {
        setFixtures((fixtures) => {
            return [...fixtures, new LineFixture(`${fixtures.length + 1}`)];
        });
        reRenderHook();
    }

    const deleteFixture = (fixture: BaseFixture) => {
        setFixtures((fixtures) => {
            return fixtures.filter((f) => {
                return f.instanceUUID !== fixture.instanceUUID;
            });
        });
        reRenderHook();
    }

    const copyFixture = (fixture: BaseFixture) => {
        setFixtures((fixtures) => {
            return [...fixtures, fixture.clone()];
        });
        reRenderHook();
    }

    return (
        <Box>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit" component="div">
                        Seraph
                    </Typography>
                </Toolbar>
            </AppBar>
            <Grid container>
                <Grid sx={{
                    maxHeight: "96vh", height: "96vh", overflowY: "scroll"
                }} item xs={4}>
                    <Typography variant="h6">
                        <Box sx={{ paddingLeft: 2, paddingTop: 1 }}>
                            <Button onClick={() => addNewFixture()}>Add new Fixture</Button>
                        </Box>
                        <FixtureList copyFixture={copyFixture} deleteFixture={deleteFixture} dmxGroupsUnique={dmxGroupsUnique} reRenderHook={reRenderHook} fixtures={fixtures} />
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