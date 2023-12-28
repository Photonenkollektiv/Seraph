import { Accordion, AccordionDetails, AccordionSummary, Card, Checkbox, Divider, FormControlLabel, FormGroup, InputLabel, Stack, TextField, Typography } from "@mui/material";
import { BaseFixture, StateTypes } from "../../engine/fixtures/BaseFixture";
import { ExpandMore } from "@mui/icons-material";
import { useState } from "react";

export type FixtureCardProps = {
    fixture: BaseFixture,
    reRenderHook: () => void
}

export const FixtureCard = (props: FixtureCardProps) => {
    const { fixture, reRenderHook } = props;
    const [fixtureName, setFixtureName] = useState<string>(fixture.fixtureName);
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
        <Card>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography variant="body1">{fixtureName} <Typography variant="caption">- {fixture.fixtureName}</Typography></Typography>
                </AccordionSummary>
                <Divider/>
                <AccordionDetails>
                    <Stack direction="column" spacing={2}>
                        <InputLabel>
                            Fixture Name
                        </InputLabel>
                        <TextField
                            variant="standard"
                            sx={{ paddingTop: 0,marginBottom: 2 }}
                            onChange={(e) => {
                                fixture.setInstanceName(e.target.value);
                                setFixtureName(e.target.value);
                            }}
                            defaultValue={fixtureName}
                        />
                        {fixture.getUISchema().map((uiElement) => {
                            switch (uiElement.type) {
                                case "heading":
                                    return (<>
                                        <Typography sx={{paddingTop:2}} variant="body1">{uiElement.fieldLabel}</Typography>
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

                </AccordionDetails>
            </Accordion>
        </Card>
    )
}