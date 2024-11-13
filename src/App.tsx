import { createEffect, createSignal, onMount } from 'solid-js';
import './App.css'
  ;
import { SceneController } from './SceneController';
import { Vector3 } from 'three';
import { MainScene } from './three/scenes/Main';
import { Col, Grid } from './components/ui/grid';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { ColorModeProvider, ColorModeScript, createLocalStorageManager } from '@kobalte/core/src/index.jsx';
import { useColorMode } from '@kobalte/core';

const App = () => {
  const storageManager = createLocalStorageManager("vite-ui-theme")
  const [controller, setController] = createSignal<MainScene>()
  // const [position, setPosition] = createSignal<THREE.Vector3 | undefined>(new Vector3(0,0,0))

  onMount(() => {
    let newController = MainScene.create(document.getElementById("scene") as HTMLElement)
    setController(newController)
  }
  )
  createEffect(() => {
    // if (controller()?.character.light.position) {
    //   setPosition(controller()?.character.light.position)
    // }
  }
  )

  return (
    <div style={{ padding: "10px" }}>
      <ColorModeScript storageType={storageManager.type} />
      <ColorModeProvider storageManager={storageManager} initialColorMode='dark'>
        <Grid cols={1} colsMd={2} colsLg={4} class="w-full gap-2">
          <Card style={{ height: "calc(100vh - 20px)" }}>
            <CardHeader>
              <CardTitle>Seraph 3D</CardTitle>
            <hr />
            </CardHeader>
            <CardContent>KPI 2</CardContent>
          </Card>
          <Col span={1} spanLg={3} >
            <Card style={{ height: "calc(100vh - 20px)" }}>
              {/* <CardHeader>
                <CardTitle>Title</CardTitle>
              </CardHeader> */}
              <div id="scene" style={{ width: "100%", height: "100%" }}></div>
            </Card>
          </Col>
        </Grid>
      </ColorModeProvider>
      {/* <div style="position:fixed; z-index:1000; display: block; left:0;top:0">
        <p>Change position: WASD / clicky </p>
        <p>Go Up: Spacebar</p>
        <p>Go Down: Shift + Space</p>
        <p> More Light: Y</p>
        <p> DIMM!: X</p>
        <button onClick={() => console.log(controller())}>test</button>
      </div>
      <div id="scene"></div> */}
    </div>
  )
}
export default App;