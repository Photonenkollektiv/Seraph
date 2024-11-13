import { createEffect, createSignal, onMount } from 'solid-js';
import './App.css';

import { MainScene } from './three/scenes/Main';
import { Col, Grid } from './components/ui/grid';
import { Card } from './components/ui/card';
import { ColorModeProvider, ColorModeScript, createLocalStorageManager } from '@kobalte/core/src/index.jsx';
import { Sidebar } from './components/Sidebar';

const App = () => {
  const storageManager = createLocalStorageManager("vite-ui-theme")
  const [controller, setController] = createSignal<MainScene>()
  // const [position, setPosition] = createSignal<THREE.Vector3 | undefined>(new Vector3(0,0,0))

  onMount(() => {
    let newController = MainScene.create(document.getElementById("scene") as HTMLElement)
    setController(newController)
  })


  createEffect(() => {
    console.log("Effect")
    if (controller()) {
      controller()?.mountEventListeners()
    }
  }
  )

  return (
    <div style={{ padding: "10px" }}>
      <ColorModeScript storageType={storageManager.type} />
      <ColorModeProvider storageManager={storageManager} initialColorMode='dark'>
        <Grid cols={1} colsMd={2} colsLg={4} class="w-full gap-2">
          <Sidebar scene={controller}/>
          <Col span={1} spanLg={3} >
            <Card style={{ height: "calc(100vh - 20px)" }}>
              {/* <CardHeader>
                <CardTitle>Title</CardTitle>
              </CardHeader> */}
              <div tabIndex="0" id="scene" style={{ width: "100%", height: "100%" }}></div>
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