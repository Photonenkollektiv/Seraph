import {  LoadingManager, Object3D, Vector3 } from "three";
import { load, postProcess } from "./Loaders";


export class ObjectModel extends Object3D {

  private _lastModel: Object3D | undefined;
  private modelname: string;
  private materialName?: string;

  constructor(private _loadingManager: LoadingManager, modelname:string, materialName?: string) {
    super();
    this.modelname = modelname;
  }



  createObject = async (envMap?: any) => {
    this.cleanUp();
    let URL = './models/'
    await load(this.modelname, URL, this._loadingManager, this.materialName).then((o: Object3D) => {
      o.receiveShadow =  false;
      o.castShadow = false;
      postProcess(o, true, envMap);
      // o.receiveShadow = true;
      // o.castShadow = true;
      o.position.set(0,0,0)
      o.scale.set(0.01, 0.01, 0.01)
      o.rotateX(Math.PI / 2)
      this.add(o);
      this._lastModel = o;
    });

  }

  cleanUp() {
    this._lastModel && this.remove(this._lastModel);
    this._lastModel = undefined;
  }

}

