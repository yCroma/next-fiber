// Client Side Renderer
import { useEffect, useRef } from 'react';
import { Box } from '@material-ui/core';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';

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
    Camera.lookAt(0, 40, 0);
    Scene.add(Camera);
    // OrbitControls
    const Controls: OrbitControls = new OrbitControls(
      Camera,
      Renderer.domElement
    );
    // Lights
    // HemisphereLight
    const HemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    // DirectionalLight
    const DirectionalLight = new THREE.DirectionalLight(0xffffff);
    // Array Lights
    const Lights: [THREE.HemisphereLight, THREE.DirectionalLight] = [
      HemisphereLight,
      DirectionalLight,
    ];
    Lights.forEach((light: THREE.Light) => {
      Scene.add(light);
    });

    // dat.GUI
    const root = new GUI({ autoPlace: false });
    Target.appendChild(root.domElement);
    root.domElement.style.position = 'absolute';
    root.domElement.style.top = '2px';
    root.domElement.style.right = `2px`;
    // adds
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
        Params.background = PresetBg;
        Params.lights.HemisphereLight = PresetLightHemi;
        Params.lights.DirectionalLight = PresetLightDire;
        datUpdateDisplayWithRecursive(folder1);
      } else {
        console.error('no preset: ', name);
      }
    }
    const folder1 = root.addFolder('parameter');
    folder1.addColor(Params, 'background').onChange((value) => {
      Scene.background = new THREE.Color(value);
    });
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
      Renderer.render(Scene, Camera);
      //console.log('Target clientWidth: ', Target.clientWidth);
    }
    function loadModel(url: string): void {
      console.log('url: ', url);
      const Loader = new FBXLoader();
      Loader.load(url, (model: THREE.Group) => {
        const LoadedModel = model;
        Scene.add(LoadedModel);
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
