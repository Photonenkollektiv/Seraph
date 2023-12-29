import { AppBar, Box, Button, Grid, Paper, Stack, TextField, Typography } from "@mui/material"
import PixelGrid, { PixelData } from "./PixelGrid/Grid"
import { BaseFixture } from "../engine/fixtures/BaseFixture";
import { useEffect, useState } from "react";
import { FixtureList } from "./FixtureList";
import { LineFixture } from "../engine/fixtures/LineFixture";
import * as _ from "lodash";
import { generateMadrixCSVFromFixtures, getPixelMapWithAddresses, pixelMapsToArray } from "../engine/EngineService";
const gridSizeX = 200;
const gridSizeY = 200;

type GridSizeInfo = {
    gridSizeX: number;
    gridSizeY: number;
}

export const Editor = () => {

    const [fixtures, setFixtures] = useState<BaseFixture[]>([
        new LineFixture("1")
    ]);

    const [gridSize, setGridSize] = useState<GridSizeInfo>({
        gridSizeX,
        gridSizeY
    });

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
                gridSizeX: gridSize.gridSizeX,
                gridSizeY: gridSize.gridSizeY
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

    const generateAndDownloadCSV = () => {
        const csv = generateMadrixCSVFromFixtures(fixtures);

        const element = document.createElement("a");
        const file = new Blob([csv], { type: 'text/csv' });
        element.href = URL.createObjectURL(file);
        element.download = "export.csv";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();

        setTimeout(() => {
            document.body.removeChild(element);
        }, 100);
    }

    return (
        <Box>
            <AppBar position="static">
                {/* <Toolbar variant="dense"> */}
                <Stack direction="row" sx={{ paddingLeft: 2, marginRight: 3 }} justifyContent={"space-between"}>
                    <Typography variant="h6" color="inherit" component="div" sx={{ paddingTop: 2 }}>
                        Seraph
                    </Typography>
                    <Stack sx={{ paddingTop: 1, marginBottom: 1 }} direction={"row"} spacing={2}>
                        <TextField
                            size="small"
                            label="Grid Size X"
                            variant="standard"
                            onChange={(e) => {
                                setGridSize((gridSize) => {
                                    return {
                                        ...gridSize,
                                        gridSizeX: parseInt(e.target.value)
                                    }
                                })
                            }}
                            value={gridSize.gridSizeX}
                            type="number"
                            fullWidth
                        />
                        <TextField
                            size="small"
                            label="Grid Size Y"
                            variant="standard"
                            onChange={(e) => {
                                setGridSize((gridSize) => {
                                    return {
                                        ...gridSize,
                                        gridSizeY: parseInt(e.target.value)
                                    }
                                })
                            }}
                            value={gridSize.gridSizeY}
                            type="number"
                            fullWidth
                        />
                        <Button sx={{ width: "10vw" }} onClick={() => generateAndDownloadCSV()}>Export CSV</Button>
                    </Stack>
                </Stack>
                {/* </Toolbar> */}
            </AppBar>
            <Grid container>
                <Grid sx={{
                    maxHeight: "94vh", height: "94vh", overflowY: "scroll"
                }} item xs={4}>
                    <Typography variant="h6">
                        <Box sx={{ paddingLeft: 2, paddingTop: 1 }}>
                            <Button onClick={() => addNewFixture()}>Add new Fixture</Button>
                        </Box>
                        <FixtureList copyFixture={copyFixture} deleteFixture={deleteFixture} dmxGroupsUnique={dmxGroupsUnique} reRenderHook={reRenderHook} fixtures={fixtures} />
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    {/* <Typography variant="h6" color="inherit"> */}
                    <PixelGrid gridSizeX={gridSize.gridSizeX} gridSizeY={gridSize.gridSizeY} pixels={pixelData} />

                    {/* </Typography> */}
                </Grid>
            </Grid>
        </Box>
    )
}