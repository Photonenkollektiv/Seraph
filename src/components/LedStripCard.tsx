import { Card, CardContent, CardHeader } from './ui/card';
import { BaseFixture } from "~/three/generators/fixtures/BaseFixture";
import Stack from "./ui/stack";
import { BsTrash } from "solid-icons/bs";
import { TextField, TextFieldInput, TextFieldLabel } from './ui/text-field';
import { Label } from './ui/label';
import { Button } from './ui/button';
type LEDStripCardProps = {
    strip: () => BaseFixture
    destroy: () => void
    focus: () => void
}

export const LEDStripCard = ({ strip, destroy,focus }: LEDStripCardProps) => {

    const updateStripPosition = (axis: "x" | "y" | "z", value: number) => {
        const position = strip().getPosition();
        switch (axis) {
            case "x":
                position.setX(value);
                break;
            case "y":
                position.setY(value);
                break;
            case "z":
                position.setZ(value);
                break;
        }
        strip().changePosition(position);
    }

    const updateStripRotation = (axis: "x" | "y" | "z", value: number) => {
        const rotation = strip().getRotation();
        switch (axis) {
            case "x":
                rotation.x = value;
                break;
            case "y":
                rotation.y = value;
                break;
            case "z":
                rotation.z = value;
                break;
        }
        strip().changeRotation(rotation);
    }


    return (<Card style={{ "margin-bottom": "10px" }}>
        <CardHeader>
            <Stack direction="row" justifyContent="space-between" alignItems='center'>
                <div style={{ width: "100%", "padding-right": "10px" }}>
                    <TextField style={{ width: "100%" }}>
                        <TextFieldInput type='text' value={strip().name} onChange={(e: Event) => strip().setName((e.target as HTMLInputElement).value)} />
                    </TextField>
                </div>
                <div>
                    <BsTrash onClick={() => destroy()} />
                </div>
            </Stack>
            <hr />
        </CardHeader>
        <CardContent>
            <TextField class="grid w-full max-w-sm items-center gap-1.5">
                <TextFieldLabel for="universe">DMX-Universe</TextFieldLabel>
                <TextFieldInput type="number" id="universe" value={strip().universe} onChange={(e: Event) => strip().setUniverse(parseInt((e.target as HTMLInputElement).value))} />
            </TextField>
            <TextField class="grid w-full max-w-sm items-center gap-1.5" style={{ "margin-top": "10px" }}>
                <TextFieldLabel for="DMX">DMX-Address</TextFieldLabel>
                <TextFieldInput type="number" id="DMX" value={strip().dmxAddress} onChange={(e: Event) => strip().setDMXAddress(parseInt((e.target as HTMLInputElement).value))} />
            </TextField>
            <div style={{ "margin-top": "20px" }}>
                <Label>Position</Label>
            </div>
            <Stack direction='row' justifyContent='space-between' alignItems='center' spacing={5}>
                <Label>X</Label>
                <TextField class="grid w-full max-w-sm items-center gap-1.5">
                    <TextFieldInput type="number" id="pos-x" value={strip().getPosition().x} onChange={(e: Event) => updateStripPosition("x", parseInt((e.target as HTMLInputElement).value))} />
                </TextField>
                <Label>Y</Label>
                <TextField class="grid w-full max-w-sm items-center gap-1.5">
                    <TextFieldInput type="number" id="pos-y" value={strip().getPosition().y} onChange={(e: Event) => updateStripPosition("y", parseInt((e.target as HTMLInputElement).value))} />
                </TextField>
                <Label>Z</Label>
                <TextField class="grid w-full max-w-sm items-center gap-1.5">
                    <TextFieldInput type="number" id="pos-z" value={strip().getPosition().z} onChange={(e: Event) => updateStripPosition("z", parseInt((e.target as HTMLInputElement).value))} />
                </TextField>
            </Stack>

            <div style={{ "margin-top": "20px" }}>
                <Label>Rotation</Label>
            </div>
            <Stack direction='row' justifyContent='space-between' alignItems='center' spacing={5}>
                <Label>X</Label>
                <TextField class="grid w-full max-w-sm items-center gap-1.5">
                    <TextFieldInput type="number" id="rot-x" value={strip().getRotation().x} onChange={(e: Event) => updateStripRotation("x", parseInt((e.target as HTMLInputElement).value))} />
                </TextField>
                <Label>Y</Label>
                <TextField class="grid w-full max-w-sm items-center gap-1.5">
                    <TextFieldInput type="number" id="rot-y" value={strip().getRotation().y} onChange={(e: Event) => updateStripRotation("y", parseInt((e.target as HTMLInputElement).value))} />
                </TextField>
                <Label>Z</Label>
                <TextField class="grid w-full max-w-sm items-center gap-1.5">
                    <TextFieldInput type="number" id="rot-z" value={strip().getRotation().z} onChange={(e: Event) => updateStripRotation("z", parseInt((e.target as HTMLInputElement).value))} />
                </TextField>
            </Stack>
            <Stack direction='row' spacing={5} style={{ "margin-top": "20px" }}>
                <Button onClick={() => focus() }>Focus Strip</Button>
            </Stack>
        </CardContent>
    </Card>)
}