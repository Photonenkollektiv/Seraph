import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Button, Card, Checkbox, Divider, FormControlLabel, FormGroup, Grid, IconButton, InputLabel, Stack, TextField, Typography } from "@mui/material";
import { BaseFixture, StateTypes } from "../../engine/fixtures/BaseFixture";
import { ContentCopy, Delete, ExpandMore } from "@mui/icons-material";
import { useState } from "react";

export type FixtureCardProps = {
    fixture: BaseFixture,
    reRenderHook: () => void,
    dmxGroupsUnique: string[],
    copyFixture: (fixture: BaseFixture) => void,
    deleteFixture: (fixture: BaseFixture) => void
}

export const FixtureCard = (props: FixtureCardProps) => {
    const { fixture, reRenderHook, dmxGroupsUnique, copyFixture, deleteFixture } = props;
    const [fixtureName, setFixtureName] = useState<string>(fixture.instanceName);
    const onDataPointChange = (key: string, value: StateTypes) => {
        fixture.setStateForKey(key, value);
        reRenderHook();
    }

    const getDataPoint = (key: string) => {
        const stateData = fixture.getStateData();
        if (stateData) {
            return stateData[key];
        }
    }

    return (
        <Card sx={{ marginBottom: 2 }}>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography variant="body1">{fixtureName} <Typography variant="caption">- {fixture.fixtureName}</Typography></Typography>
                </AccordionSummary>
                <Divider />
                <AccordionDetails>
                    <Stack direction="column" spacing={2}>
                        <InputLabel>
                            Fixture Name
                        </InputLabel>
                        <TextField
                            variant="standard"
                            sx={{ paddingTop: 0, marginBottom: 2 }}
                            onChange={(e) => {
                                fixture.setInstanceName(e.target.value);
                                setFixtureName(e.target.value);
                            }}
                            defaultValue={fixtureName}
                        />
                        <Typography sx={{ paddingTop: 2 }} variant="body1">DMX</Typography>
                        <Divider />
                        <Grid container>
                            <Grid item xs={6} sx={{ paddingRight: 1 }}>
                                <InputLabel>
                                    DMX Group
                                </InputLabel>
                                <Autocomplete
                                    disablePortal
                                    options={dmxGroupsUnique}
                                    defaultValue={fixture.dmxGroup}
                                    onChange={(e, value) => {
                                        if (value) {
                                            fixture.setDMXGroup(value);
                                            reRenderHook();
                                        }
                                    }}
                                    // sx={{ width: 300 }}
                                    renderInput={(params) => <TextField variant="standard" {...params} />}
                                />
                            </Grid>
                            <Grid item xs={6} sx={{ paddingLeft: 1 }}>
                                <InputLabel>
                                    DMX Group order
                                </InputLabel>
                                <TextField
                                    variant="standard"
                                    onChange={(e) => {
                                        fixture.setDMXGroupOrder(parseInt(e.target.value));
                                        reRenderHook();
                                    }}
                                    defaultValue={fixture.dmxGroupOrder}
                                    type="number"
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                        {fixture.getUISchema().map((uiElement) => {
                            switch (uiElement.type) {
                                case "heading":
                                    return (<>
                                        <Typography sx={{ paddingTop: 2 }} variant="body1">{uiElement.fieldLabel}</Typography>
                                        <Divider />
                                    </>)
                                case "string":
                                    return (<>
                                        <InputLabel>
                                            {uiElement.fieldLabel}
                                        </InputLabel>
                                        <TextField
                                            variant="standard"
                                            onChange={(e) => onDataPointChange(uiElement.fieldStateName, e.target.value)}
                                            defaultValue={getDataPoint(uiElement.fieldStateName)}
                                        />
                                        <Typography variant="caption">{uiElement.fieldDescription}</Typography>
                                    </>)
                                case "number":
                                    return (<>
                                        <InputLabel>
                                            {uiElement.fieldLabel}
                                        </InputLabel>
                                        <TextField
                                            variant="standard"
                                            onChange={(e) => onDataPointChange(uiElement.fieldStateName, parseInt(e.target.value))}
                                            defaultValue={getDataPoint(uiElement.fieldStateName)}
                                            type="number"
                                        />
                                        <Typography variant="caption">{uiElement.fieldDescription}</Typography>
                                    </>)
                                case "boolean":
                                    return (<>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={<Checkbox
                                                    defaultChecked={getDataPoint(uiElement.fieldStateName) === true}
                                                    onChange={(e) => { onDataPointChange(uiElement.fieldStateName, e.target.checked) }}
                                                />}
                                                label={uiElement.fieldLabel} />
                                            <Typography variant="caption">{uiElement.fieldDescription}</Typography>
                                        </FormGroup>
                                    </>)
                            }
                        })}

                    </Stack>
                    <Stack justifyContent={"end"} direction="row" spacing={2}>
                        <Button startIcon={<ContentCopy />} variant="text" onClick={() => {
                            copyFixture(fixture);
                        }}>Copy</Button>
                        <Button startIcon={<Delete />} variant="text" color="error" onClick={() => {
                            deleteFixture(fixture);
                        }}>Delete</Button>
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </Card>
    )
}