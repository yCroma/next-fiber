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
    const Lights: Array<THREE.Light> = [];
    // HemisphereLight
    const HemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    Lights.push(HemisphereLight);
    Scene.add(Lights[0]);
    // DirectionalLight
    const DirectionalLight = new THREE.DirectionalLight(0xffffff);
    Lights.push(DirectionalLight);
    Scene.add(Lights[1]);
    // PointLight
    const PointLight = new THREE.PointLight();
    Lights.push(PointLight);
    // RectAreaLight
    const RectAreaLight = new THREE.RectAreaLight();
    Lights.push(RectAreaLight);

    // dat.GUI
    const root = new GUI({ autoPlace: false });
    Target.appendChild(root.domElement);
    root.domElement.style.position = 'absolute';
    root.domElement.style.top = '2px';
    root.domElement.style.right = `2px`;
    // adds
    const Params = {
      background: `#${Scene.background.getHexString()}`,
      lights: {
        HemisphereLight: {
          skyColor: `#${HemisphereLight.color.getHexString()}`,
          groundColor: `#${HemisphereLight.groundColor.getHexString()}`,
          intensity: HemisphereLight.intensity,
        },
      },
    };
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
        Scene.remove(Lights[0]);
        Lights[0] = new THREE.HemisphereLight(
          value,
          Params.lights.HemisphereLight.groundColor,
          HemisphereLight.intensity
        );
        Scene.add(Lights[0]);
      });
    folder111
      .addColor(Params.lights.HemisphereLight, 'groundColor')
      .onChange((value) => {
        Params.lights.HemisphereLight.groundColor = value;
        Scene.remove(Lights[0]);
        Lights[0] = new THREE.HemisphereLight(
          Params.lights.HemisphereLight.skyColor,
          value,
          HemisphereLight.intensity
        );
        Scene.add(Lights[0]);
      });
    folder111
      .add(Params.lights.HemisphereLight, 'intensity', 0, 4, 0.1)
      .onChange((value) => {
        Params.lights.HemisphereLight.intensity = value;
        Scene.remove(Lights[0]);
        Lights[0] = new THREE.HemisphereLight(
          Params.lights.HemisphereLight.skyColor,
          Params.lights.HemisphereLight.groundColor,
          value
        );
        Scene.add(Lights[0]);
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
