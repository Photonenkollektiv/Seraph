import { MainScene } from '~/three/scenes/Main';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import LEDStrip from '~/three/generators/fixtures/LEDStrip';
import { Euler, Vector3 } from 'three';
import { createSignal } from 'solid-js';
import { Button } from './ui/button';
import { LEDStripCard } from './LedStripCard';

type SidebarProps = {
    scene: () => MainScene | undefined
}

export const Sidebar = ({ scene }: SidebarProps) => {

    const [strips, setStrips] = createSignal<LEDStrip[]>([])

    const createNewStrip = () => {
        const randZ = Math.random() * 10;
        const ledStripOptions = {
            pixelsPerMeter: 60,
            lengthInMeter: 2,
            startPosition: new Vector3(0, 0, randZ),
            direction: new Euler(0, 0, 0) // roll, yaw, pitch
        };
        const sceneUnfolded = scene()
        if (!sceneUnfolded) return;
        const ledStrip = new LEDStrip(ledStripOptions, sceneUnfolded);
        setStrips([...strips(), ledStrip])
    }

    return (<Card style={{ height: "calc(100vh - 20px)" }}>
        <CardHeader>
            <CardTitle>Seraph 3D</CardTitle>
            <hr />
        </CardHeader>
        <CardContent>
            <Button onClick={createNewStrip}>Create LED Strip</Button>
            {strips().map(strip => {
                return (
                    <LEDStripCard destroy={() => {
                        strip.destroy()
                        const newStrips = strips().filter(s => s !== strip)
                        setStrips(newStrips)
                    }}
                    strip={() => strip}
                    focus={() => {
                        scene()?.focusOn(strip.getBorderMesh())
                    }} />
                )
            })}
        </CardContent>
    </Card>)
}