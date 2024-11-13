import { LoadingManager, Material, Mesh, MeshBasicMaterial, MeshNormalMaterial, MeshPhongMaterial, Object3D, TextureLoader } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

function ext(urlIn: string): string {
  let filename = urlIn;
  try {
    const url = new URL(urlIn);
    filename = url.pathname.split('/').pop() || filename;
  } finally {
    const ext = filename?.split('.').pop() || '';
    return ext;
  }
}

export async function load(url: string, basePath: string, manager?: LoadingManager, materialName?: string): Promise<Object3D> {

  let ex = ext(url)


  switch (ex) {
    case 'fbx':
      return loadFBX(url, basePath, manager);
    case 'glb': // TODO: do binary work?
      return loadGLTF(url, basePath, manager);
    case 'gltf':
      return loadGLTF(url, basePath, manager);
    case 'dae':
      return loadCollada(url, basePath, manager, materialName);
  }
  throw 'File type "' + ex + '" not supported';

}

export function loadCollada(url: string, basePath: string, manager?: LoadingManager, materialName?: string): Promise<Object3D> {
  return new Promise<Object3D>((resolve, reject) => {
    const textureLoader = new TextureLoader(manager);
    const loader = new ColladaLoader(manager);
    loader.setPath(basePath);
    loader.load(url, function (collada) {
      if (materialName) {
        collada.scene.traverse((child) => {
          if (child instanceof Mesh) {
            child.material = new MeshBasicMaterial({ vertexColors: true });
          }
        });
      }
      // postProcess(collada.scene, true, null);
      resolve(collada.scene);
    }, undefined, (e) => { reject(e.message) });
  });
}



export function loadFBX(url: string, basePath: string, manager?: LoadingManager): Promise<Object3D> {
  return new Promise<Object3D>((resolve, reject) => {

    const loader = new FBXLoader(manager);
    loader.setPath(basePath);
    loader.load(url, function (object) {
      postProcess(object, true, null);
      
      // texture.encoding = THREE.sRGBEncoding;
      resolve(object);
    }, undefined, (e) => { reject(e.message) });
  });
}

export function loadGLTF(url: string, basePath: string, manager?: LoadingManager): Promise<Object3D> {
  return new Promise<Object3D>((resolve, reject) => {

    const loader = new GLTFLoader(manager);
    // const dracoLoader = new DRACOLoader();
    // dracoLoader.setDecoderPath('/examples/jsm/libs/draco/');
    // loader.setDRACOLoader(dracoLoader);
    loader.setPath(basePath);
    loader.load(url, (gltf: GLTF) => {

      resolve(gltf.scene);
    }, undefined, (e) => { reject(e.message) });
  });
}

export function postProcess(object: Object3D, shadows: boolean, envMap: any) {
  object.traverse(function (child: Object3D) {
    if ((child as Mesh).isMesh) {
      child.castShadow = shadows;
      child.receiveShadow = shadows;
      ((child as Mesh).material as any).envMap = envMap;
      ((child as Mesh).material as any).metalness = 0.7;
    }
  });
}

