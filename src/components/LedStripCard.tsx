import LEDStrip from "~/three/generators/fixtures/LEDStrip"
import { MainScene } from "~/three/scenes/Main"
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BaseFixture } from "~/three/generators/fixtures/BaseFixture";
import { Button } from "@kobalte/core";
import Stack from "./ui/stack";
import { BsTrash } from "solid-icons/bs";
type LEDStripCardProps = {
    strip: () => BaseFixture
    destroy: () => void
}

export const LEDStripCard = ({  strip, destroy }: LEDStripCardProps) => {
    return (<Card style={{ "margin-bottom": "10px" }}>
        <CardHeader>
            <Stack direction="row" justifyContent="space-between">
                <div>
                    <CardTitle>{strip().name}</CardTitle>
                </div>
                <div>
                    <BsTrash onClick={() => destroy()} />

                </div>
            </Stack>
            <hr />
        </CardHeader>
        <CardContent>
        </CardContent>
    </Card>)
}