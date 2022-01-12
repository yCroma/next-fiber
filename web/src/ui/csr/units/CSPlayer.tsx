// Client Side Renderer
import { useEffect, useRef } from 'react';
import { Box } from '@material-ui/core';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI, GUIController } from 'dat.gui';
import clone from 'clone';

const CSRenderer = ({
  fbxurl,
  mode,
  settings,
}: {
  fbxurl: string;
  mode: string;
  settings?: Object;
}) => {
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
      loaded: boolean;
    } = LoadModel(fbxurl);
    // Helpers
    // axesHelper
    const axesHelper = new THREE.AxesHelper(1000);
    Scene.add(axesHelper);
    // cameraHelper
    const cameraHelper = new THREE.CameraHelper(Camera);
    // Scene.add(cameraHelper);

    // adds
    // preset
    const Settings = settings || {
      clips: clone(DefaultClip),
      presets: clone(DefaultPreset),
    };
    /**
     * 方針：
     * 1. .listen()が適応できない値はParamsを介して操作する
     * 2. Paramsに関連する値はonChange毎にupdateすること(.listen()でないと自動で更新されないから)
     * 3. action, preset 共に初期値のindexは0
     */
    const Params = {
      preset: Settings['clips'][Object.keys(Settings['clips'])[0]]['preset'],
      presets: Settings!['presets'],
      clip: Object.keys(Settings['clips'])[0],
      clips: Settings['clips'],
      controllers: {
        animation: {
          action: 0,
          time: 0,
          start: 0,
          end: 0,
          velocity: 0,
        },
        camera: {
          position: {
            reset: resetPosition,
          },
          lookat: {
            x: 0,
            y: 5,
            z: 0,
            reset: resetTarget,
          },
        },
        model: {
          velocity: 1.0,
          scale: 1.0,
        },
      },
      parameters: {
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
    // dat.GUI
    const root = new GUI({ autoPlace: false });
    Target.appendChild(root.domElement);
    root.domElement.style.position = 'absolute';
    root.domElement.style.top = '2px';
    root.domElement.style.right = `2px`;
    // folders
    const folder1 = root.addFolder('parameter');
    const folder2 = root.addFolder('controllers');
    const folder3 = root.addFolder('helpers');
    const folder11 = folder1.addFolder('lights');
    const folder111 = folder11.addFolder('hemisphereLight');
    const folder112 = folder11.addFolder('directionalLight');
    const folder113 = folder11.addFolder('ambientLight');
    const folder21 = folder2.addFolder('camera');
    const folder22 = folder2.addFolder('model');
    const folder210 = folder21.addFolder('position');
    const folder211 = folder21.addFolder('lookAt');
    folder1.addColor(Params, 'background').onChange((value) => {
      Scene.background = new THREE.Color(value);
    });
    // Lights
    // HemisphereLight
    folder111
      .addColor(Params.parameters.lights.HemisphereLight, 'skyColor')
      .onChange((value) => {
        Params.parameters.lights.HemisphereLight.skyColor = value;
        HemisphereLight.color = new THREE.Color(value);
      });
    folder111
      .addColor(Params.parameters.lights.HemisphereLight, 'groundColor')
      .onChange((value) => {
        Params.parameters.lights.HemisphereLight.groundColor = value;
        HemisphereLight.groundColor = new THREE.Color(value);
      });
    folder111
      .add(Params.parameters.lights.HemisphereLight, 'intensity', 0, 4, 0.1)
      .onChange((value) => {
        Params.parameters.lights.HemisphereLight.intensity = value;
        HemisphereLight.intensity = value;
      });
    // DirectionalLight
    folder112
      .addColor(Params.parameters.lights.DirectionalLight, 'color')
      .onChange((value) => {
        Params.parameters.lights.DirectionalLight.color = value;
        DirectionalLight.color = new THREE.Color(value);
      });
    folder112
      .add(Params.parameters.lights.DirectionalLight, 'intensity', 0, 4, 0.1)
      .onChange((value) => {
        Params.parameters.lights.DirectionalLight.intensity = value;
        DirectionalLight.intensity = value;
      });
    // AmbientLight
    folder113
      .addColor(Params.parameters.lights.AmbientLight, 'color')
      .onChange((value) => {
        Params.parameters.lights.AmbientLight.color = value;
        AmbientLight.color = new THREE.Color(value);
      });
    folder113
      .add(Params.parameters.lights.AmbientLight, 'intensity', 0, 4, 0.1)
      .onChange((value) => {
        Params.parameters.lights.AmbientLight.intensity = value;
        AmbientLight.intensity = value;
      });

    // Controllers
    // Camera
    // position
    folder210.add(Camera.position, 'x').listen();
    folder210.add(Camera.position, 'y').listen();
    folder210.add(Camera.position, 'z').listen();
    folder210.add(Params.controllers.camera.position, 'reset');
    // lookAt
    folder211
      .add(Params.controllers.camera.lookat, 'x', -500, 500, 1)
      .onChange((value: number) => {
        const vector3 = new THREE.Vector3(
          value,
          Params.controllers.camera.lookat.y,
          Params.controllers.camera.lookat.z
        );
        Controls.target = vector3;
        Controls.update();
      });
    folder211
      .add(Params.controllers.camera.lookat, 'y', -100, 100, 1)
      .onChange((value: number) => {
        const vector3 = new THREE.Vector3(
          Params.controllers.camera.lookat.x,
          value,
          Params.controllers.camera.lookat.z
        );
        Controls.target = vector3;
        Controls.update();
      });
    folder211
      .add(Params.controllers.camera.lookat, 'z', -180, 180, 1)
      .onChange((value: number) => {
        const vector3 = new THREE.Vector3(
          Params.controllers.camera.lookat.x,
          Params.controllers.camera.lookat.y,
          value
        );
        Controls.target = vector3;
        Controls.update();
      });
    // lookat reset
    folder211.add(Params.controllers.camera.lookat, 'reset');

    // velocity
    folder22.add(Params.model, 'velocity', 0, 2, 0.01);
    // scale
    folder22
      .add(Params.controllers.model, 'scale', 0, 2.0, 0.1)
      .onChange((value: number) => {
        if (Model['model']) {
          Model['model'].scale.set(1, 1, 1);
          Model['model'].scale.multiplyScalar(value);
        }
      });

    // Helpers
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
    watchModelLoad();
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
    function watchModelLoad() {
      /**
       * Params宣言時では、モデルの読み込みは完了していない
       * よって、モデルの読み込みが完了時に、関連する情報を
       * 初期化する必要がある
       * そのための関数
       */
      const finishLoad = Model['model'] && Model['animations'];
      if (!finishLoad) {
        requestAnimationFrame(watchModelLoad);
      } else {
        console.log('Loaded Model: ', Model);
        Scene.add(Model['model'] as THREE.Group);
        Model['actions']![0].play();
      }
    }
    function resetPosition() {
      Camera.position.set(0, 10, 50);
      Controls.update();
    }
    function resetTarget() {
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
    function AdaptPreset(name: string): void {
      if (Presets[name]) {
        console.log('name: ', name);
        const obj = clone(Presets[name]);
        const PresetBg = obj.background;
        const PresetLightHemi = clone(obj.lights.HemisphereLight);
        const PresetLightDire = clone(obj.lights.DirectionalLight);
        const PresetLightAmb = clone(obj.lights.AmbientLight);
        // adapt
        Scene.background = new THREE.Color(PresetBg);
        Lights[0].color = new THREE.Color(PresetLightHemi.skyColor);
        Lights[0].groundColor = new THREE.Color(PresetLightHemi.groundColor);
        Lights[0].intensity = PresetLightHemi.intensity;
        Lights[1].color = new THREE.Color(PresetLightDire.color);
        Lights[1].intensity = PresetLightDire.intensity;
        Lights[2].color = new THREE.Color(PresetLightAmb.color);
        Lights[2].intensity = PresetLightAmb.intensity;
        // storeを更新
        // uiを更新する
        Params.parameters.background = `#${Scene.background.getHexString()}`;
        Params.parameters.lights.HemisphereLight.skyColor = `#${HemisphereLight.color.getHexString()}`;
        Params.parameters.lights.HemisphereLight.groundColor = `#${HemisphereLight.groundColor.getHexString()}`;
        Params.parameters.lights.HemisphereLight.intensity =
          HemisphereLight.intensity;
        Params.parameters.lights.DirectionalLight.color = `#${DirectionalLight.color.getHexString()}`;
        Params.parameters.lights.DirectionalLight.intensity =
          DirectionalLight.intensity;
        Params.parameters.lights.AmbientLight.color = `#${AmbientLight.color.getHexString()}`;
        Params.parameters.lights.AmbientLight.intensity =
          AmbientLight.intensity;
        datUpdateDisplayWithRecursive(folder1);
      } else {
        console.error('no preset: ', name);
      }
    }
  }, []);
  return (
    <Box
      sx={{ width: '100%', height: '400px', position: 'relative' }}
      ref={TargetRef}
    ></Box>
  );
};

export default CSRenderer;
const DefaultPreset = {
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
      AmbientLight: {
        color: '#ffffff',
        intensity: 0,
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
      DirectionalLight: {
        color: '#ffffff',
        intensity: 1,
      },
      AmbientLight: {
        color: '#ffffff',
        intensity: 0,
      },
    },
  },
  Gray: {
    background: '#b5b5b5',
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
      AmbientLight: {
        color: '#ffffff',
        intensity: 0,
      },
    },
  },
  Black: {
    background: '#000000',
    lights: {
      HemisphereLight: {
        skyColor: '#ffffff',
        groundColor: '#666666',
        intensity: 1,
      },
      DirectionalLight: {
        color: '#ffffff',
        intensity: 1,
      },
      AmbientLight: {
        color: '#ffffff',
        intensity: 0,
      },
    },
  },
  Ambient: {
    background: '#e5e5e5',
    lights: {
      HemisphereLight: {
        skyColor: '#ffffff',
        groundColor: '#444444',
        intensity: 0,
      },
      DirectionalLight: {
        color: '#ffffff',
        intensity: 0,
      },
      AmbientLight: {
        color: '#ffffff',
        intensity: 1,
      },
    },
  },
};

const DefaultClip = {
  default: {
    animation: {
      action: 0,
      start: 0,
      end: 0,
    },
    camera: {
      lookat: {
        x: 0,
        y: 5,
        z: 0,
      },
      position: {
        x: 0,
        y: 10,
        z: 50,
      },
    },
    preset: Object.keys(DefaultPreset)[0],
  },
};
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

function LoadModel(url: string): {
  model?: THREE.Group;
  mixer?: THREE.AnimationMixer;
  animations?: Array<THREE.AnimationClip>;
  actions?: Array<THREE.AnimationAction>;
  loaded: boolean;
} {
  const Loader = new FBXLoader();
  const obj: {
    model?: THREE.Group;
    mixer?: THREE.AnimationMixer;
    animations?: Array<THREE.AnimationClip>;
    actions?: Array<THREE.AnimationAction>;
    loaded: boolean;
  } = {
    model: undefined,
    mixer: undefined,
    animations: undefined,
    actions: undefined,
    loaded: false,
  };
  Loader.load(url, (model: THREE.Group) => {
    const mixer: THREE.AnimationMixer = new THREE.AnimationMixer(model);
    const animations: Array<THREE.AnimationClip> = model.animations;
    const actions: Array<THREE.AnimationAction> = [];
    animations.forEach((animation: THREE.AnimationClip) => {
      actions.push(mixer.clipAction(animation));
    });
    obj['model'] = model;
    obj['mixer'] = mixer;
    obj['animations'] = animations;
    obj['actions'] = actions;
    obj['loaded'] = true;
  });
  return obj;
}
