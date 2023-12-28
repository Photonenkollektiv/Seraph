import { Accordion, AccordionDetails, AccordionSummary, Card, Checkbox, Divider, FormControlLabel, FormGroup, InputLabel, Stack, TextField, Typography } from "@mui/material";
import { BaseFixture, StateTypes } from "../../engine/fixtures/BaseFixture";
import { ExpandMore } from "@mui/icons-material";

export type FixtureCardProps = {
    fixture: BaseFixture,
    reRenderHook: () => void
}

export const FixtureCard = (props: FixtureCardProps) => {
    const { fixture, reRenderHook } = props;

    const onDataPointChange = (key: string, value: StateTypes) => {
        fixture.setStateForKey(key, value);
        // reRenderHook();
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
                    <Typography variant="body1">{fixture.instanceName} <Typography variant="caption">- {fixture.fixtureName}</Typography></Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack direction="column" spacing={2}>
                        {fixture.getUISchema().map((uiElement) => {
                            switch (uiElement.type) {
                                case "heading":
                                    return (<>
                                        <Typography variant="body1">{uiElement.fieldLabel}</Typography>
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
                                            onChange={(e) => onDataPointChange(uiElement.fieldStateName, e.target.value)}
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