// Client Side Renderer
import { useEffect, useRef } from 'react';
import { Box } from '@material-ui/core';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI, GUIController } from 'dat.gui';

const CSRenderer = ({ fbxurl }: { fbxurl: string }) => {
  const TargetRef = useRef(null!);
  useEffect(() => {
    const Target: HTMLDivElement = TargetRef.current;
    // initialization
    const width = Target.clientWidth | 400;
    const height = Target.clientHeight | 300;
    // Scene
    const Scene: THREE.Scene = new THREE.Scene();
    Scene.background = new THREE.Color(0xf0f0f0);
    // Renderer
    const Renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
    /**
     * レンダラーは必ずsetSizeしてください
     * 挙動が不安定になります
     */
    Renderer.setSize(width, height);
    Renderer.setPixelRatio(window.devicePixelRatio);
    Target.appendChild(Renderer.domElement);
    // Camera
    const Camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      45,
      width / height,
      1,
      1000
    );
    Camera.position.set(0, 10, 50);
    Scene.add(Camera);
    // OrbitControls
    const Controls: OrbitControls = new OrbitControls(
      Camera,
      Renderer.domElement
    );
    Controls.target = new THREE.Vector3(0, 5, 0);
    Controls.update();
    // Lights
    // HemisphereLight
    const HemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    // DirectionalLight
    const DirectionalLight = new THREE.DirectionalLight(0xffffff);
    // AmbientLight
    const AmbientLight = new THREE.AmbientLight(0xffffff, 0);
    // Array Lights
    const Lights: [
      THREE.HemisphereLight,
      THREE.DirectionalLight,
      THREE.AmbientLight
    ] = [HemisphereLight, DirectionalLight, AmbientLight];
    Lights.forEach((light: THREE.Light) => {
      Scene.add(light);
    });
    // Clock
    const Clock: THREE.Clock = new THREE.Clock();
    // Model
    const Model: {
      model?: THREE.Group;
      mixer?: THREE.AnimationMixer;
      animations?: THREE.AnimationClip[];
      actions?: THREE.AnimationAction[];
      currentAction: number;
      loaded: boolean;
    } = {
      model: undefined,
      mixer: undefined,
      animations: undefined,
      actions: undefined,
      currentAction: 0,
      loaded: false,
    };
    // Helpers
    // axesHelper
    const axesHelper = new THREE.AxesHelper(1000);
    Scene.add(axesHelper);
    // cameraHelper
    const cameraHelper = new THREE.CameraHelper(Camera);
    // Scene.add(cameraHelper);

    // dat.GUI
    const root = new GUI({ autoPlace: false });
    Target.appendChild(root.domElement);
    root.domElement.style.position = 'absolute';
    root.domElement.style.top = '2px';
    root.domElement.style.right = `2px`;
    // adds
    /**
     * 方針：
     * 1. 各コントローラは、Paramsを参照する
     * 2. onChange毎にupdateすること
     */
    const Params = {
      preset: 'default',
      background: `#${Scene.background.getHexString()}`,
      lights: {
        HemisphereLight: {
          skyColor: `#${HemisphereLight.color.getHexString()}`,
          groundColor: `#${HemisphereLight.groundColor.getHexString()}`,
          intensity: HemisphereLight.intensity,
        },
        DirectionalLight: {
          color: `#${DirectionalLight.color.getHexString()}`,
          intensity: DirectionalLight.intensity,
        },
        AmbientLight: {
          color: `#${AmbientLight.color.getHexString()}`,
          intensity: AmbientLight.intensity,
        },
      },
      camera: {
        lookat: {
          x: 0,
          y: 5,
          z: 0,
        },
        reset: resetTarget,
      },
      model: {
        velocity: 1.0,
        scale: 1.0,
      },
      helpers: {
        axes: true,
        camera: false,
      },
    };
    // preset
    root
      .add(Params, 'preset', [
        'default',
        'Black',
        'Gray',
        'White',
        'Ambient',
        'Bright',
      ])
      .onChange(AdaptPreset);
    const Presets = {
      default: {
        background: '#f0f0f0',
        lights: {
          HemisphereLight: {
            skyColor: '#ffffff',
            groundColor: '#444444',
            intensity: 1,
          },
          DirectionalLight: {
            color: '#ffffff',
            intensity: 1,
          },
        },
      },
      White: {
        background: '#ffffff',
        lights: {
          HemisphereLight: {
            skyColor: '#d6d6d6',
            groundColor: '#f7f7f7',
            intensity: 0.8,
          },
        },
      },
      Gray: {
        background: '#b5b5b5',
      },
      Black: {
        background: '#000000',
        lights: {
          HemisphereLight: {
            skyColor: '#ffffff',
            groundColor: '#666666',
            intensity: 1,
          },
        },
      },
    } as const;
    function ReadPresetObj(obj: Object, defvalue: Object, key: string): Object {
      /**
       * オブジェクト型では、プリミティブ型と違い
       * 代入時にundefinedではじかれることがあった
       * Presetの仕様を維持するために、tryで巻き上げた
       */
      try {
        // undefined はもれなく初期値を利用する
        if (obj[key]) {
          return { ...obj[key] };
        } else {
          throw new Error('初期値を返す');
        }
      } catch (error) {
        return { ...defvalue[key] };
      }
    }
    function AdaptPreset(name: string): void {
      if (Presets[name]) {
        console.log('name: ', name);
        const obj = { ...Presets[name] };
        const PresetBg = obj.background || Presets.default.background;
        const PresetLightHemi = ReadPresetObj(
          obj.lights,
          Presets.default.lights,
          'HemisphereLight'
        );
        const PresetLightDire = ReadPresetObj(
          obj.lights,
          Presets.default.lights,
          'DirectionalLight'
        );
        // adapt
        Scene.background = new THREE.Color(PresetBg);
        Lights[0].color = new THREE.Color(PresetLightHemi.skyColor);
        Lights[0].groundColor = new THREE.Color(PresetLightHemi.groundColor);
        Lights[0].intensity = PresetLightHemi.intensity;
        Lights[1].color = new THREE.Color(PresetLightDire.color);
        Lights[1].intensity = PresetLightDire.intensity;
        // storeを更新
        // uiを更新する
        Params.background = `#${Scene.background.getHexString()}`;
        Params.lights.HemisphereLight.skyColor = `#${HemisphereLight.color.getHexString()}`;
        Params.lights.HemisphereLight.groundColor = `#${HemisphereLight.groundColor.getHexString()}`;
        Params.lights.HemisphereLight.intensity = HemisphereLight.intensity;
        Params.lights.DirectionalLight.color = `#${DirectionalLight.color.getHexString()}`;
        Params.lights.DirectionalLight.intensity = DirectionalLight.intensity;
        datUpdateDisplayWithRecursive(folder1);
      } else {
        console.error('no preset: ', name);
      }
    }
    function datUpdateDisplayWithRecursive(folder: GUI): void {
      // update all folder & __controllers revursively
      /**
       * dat.GUIはlisten()で値の監視と更新を行うことができる。
       * がしかし、今回はすべてをonChangeを用いて処理している。
       * よって、プログラム側から更新する必要がある。
       * onChangeの採用理由としては、カラーコードの見た目を整えるため。
       * （THREE.jsのcolorはデフォルトでrgbを出力する。利用したい
       * 値は16進数であるから、前処理が必要）
       */
      const recursiveUpdate = (gui: GUI) => {
        gui.__controllers.forEach((controller: GUIController) => {
          controller.updateDisplay();
        });
        Object.keys(gui.__folders).forEach((key: string) => {
          recursiveUpdate(gui.__folders[key]);
        });
      };
      recursiveUpdate(folder);
    }
    const folder1 = root.addFolder('parameter');
    folder1.addColor(Params, 'background').onChange((value) => {
      Scene.background = new THREE.Color(value);
    });
    // Lights
    const folder11 = folder1.addFolder('lights');
    // HemisphereLight
    const folder111 = folder11.addFolder('hemisphereLight');
    folder111
      .addColor(Params.lights.HemisphereLight, 'skyColor')
      .onChange((value) => {
        Params.lights.HemisphereLight.skyColor = value;
        HemisphereLight.color = new THREE.Color(value);
      });
    folder111
      .addColor(Params.lights.HemisphereLight, 'groundColor')
      .onChange((value) => {
        Params.lights.HemisphereLight.groundColor = value;
        HemisphereLight.groundColor = new THREE.Color(value);
      });
    folder111
      .add(Params.lights.HemisphereLight, 'intensity', 0, 4, 0.1)
      .onChange((value) => {
        Params.lights.HemisphereLight.intensity = value;
        HemisphereLight.intensity = value;
      });
    // DirectionalLight
    const folder112 = folder11.addFolder('directionalLight');
    folder112
      .addColor(Params.lights.DirectionalLight, 'color')
      .onChange((value) => {
        Params.lights.DirectionalLight.color = value;
        DirectionalLight.color = new THREE.Color(value);
      });
    folder112
      .add(Params.lights.DirectionalLight, 'intensity', 0, 4, 0.1)
      .onChange((value) => {
        Params.lights.DirectionalLight.intensity = value;
        DirectionalLight.intensity = value;
      });

    // Controllers
    const folder2 = root.addFolder('controllers');
    // Camera
    const folder21 = folder2.addFolder('camera');
    // lookAt
    const folder211 = folder21.addFolder('lookAt');
    folder211
      .add(Params.camera.lookat, 'x', -500, 500, 1)
      .onChange((value: number) => {
        const vector3 = new THREE.Vector3(
          value,
          Params.camera.lookat.y,
          Params.camera.lookat.z
        );
        Controls.target = vector3;
        Controls.update();
      });
    folder211
      .add(Params.camera.lookat, 'y', -100, 100, 1)
      .onChange((value: number) => {
        const vector3 = new THREE.Vector3(
          Params.camera.lookat.x,
          value,
          Params.camera.lookat.z
        );
        Controls.target = vector3;
        Controls.update();
      });
    folder211
      .add(Params.camera.lookat, 'z', -180, 180, 1)
      .onChange((value: number) => {
        const vector3 = new THREE.Vector3(
          Params.camera.lookat.x,
          Params.camera.lookat.y,
          value
        );
        Controls.target = vector3;
        Controls.update();
      });
    // lookat reset
    folder211.add(Params.camera, 'reset');

    function resetTarget() {
      Camera.position.set(0, 10, 50);
      Controls.target = new THREE.Vector3(0, 5, 0);
      Controls.update();
      /**
       * JSONは明示的に更新しないと、updateできなかった
       * いじらないよう注意
       */
      Params.camera.lookat.x = 0;
      Params.camera.lookat.y = 5;
      Params.camera.lookat.z = 0;
      datUpdateDisplayWithRecursive(folder211);
    }
    const folder22 = folder2.addFolder('model');
    // velocity
    const folder221 = folder22.add(Params.model, 'velocity', 0, 2, 0.01);
    // scale
    const folder222 = folder22
      .add(Params.model, 'scale', 0, 2.0, 0.1)
      .onChange((value: number) => {
        if (Model['model']) {
          Model['model'].scale.set(1, 1, 1);
          Model['model'].scale.multiplyScalar(value);
        }
      });

    // Helpers
    const folder3 = root.addFolder('helpers');
    // axesHelper
    folder3.add(Params.helpers, 'axes').onChange((value: boolean) => {
      if (value) {
        Scene.add(axesHelper);
      } else {
        Scene.remove(axesHelper);
      }
    });
    // cameraHelper
    folder3.add(Params.helpers, 'camera').onChange((value: boolean) => {
      if (value) {
        Scene.add(cameraHelper);
      } else {
        Scene.remove(cameraHelper);
      }
    });
    loadModel(fbxurl);
    let prevWidth: number, prevHeight: number;
    animate();
    function animate() {
      requestAnimationFrame(animate);
      if (
        prevWidth !== Target.clientWidth ||
        prevHeight !== Target.clientHeight
      ) {
        Renderer.setSize(Target.clientWidth, Target.clientHeight);
        const _canvas = Renderer.domElement;
        Camera.aspect = _canvas.clientWidth / _canvas.clientHeight;
        Camera.updateMatrix();
        [prevWidth, prevHeight] = [Target.clientWidth, Target.clientHeight];
      }
      if (Model['loaded']) {
        Model['mixer']?.update(Clock.getDelta() * Params.model.velocity);
      }
      Renderer.render(Scene, Camera);
      //console.log('Target clientWidth: ', Target.clientWidth);
    }
    function loadModel(url: string): void {
      console.log('url: ', url);
      const Loader = new FBXLoader();
      Loader.load(url, (model: THREE.Group) => {
        const LoadedModel = model;
        Model['model'] = model;
        Model['mixer'] = new THREE.AnimationMixer(model);
        Model['animations'] = model.animations;
        Model['actions'] = [];
        Model['animations'].forEach((animation: THREE.AnimationClip) => {
          Model['actions']!.push(Model['mixer']!.clipAction(animation));
        });
        Model['loaded'] = true;
        Scene.add(LoadedModel);
        Model['actions'][Model.currentAction].play();
      });
    }
    console.log('Dom afterthree: ', TargetRef.current);
  }, []);
  return (
    <Box
      sx={{ width: '100%', height: '400px', position: 'relative' }}
      ref={TargetRef}
    ></Box>
  );
};

export default CSRenderer;
