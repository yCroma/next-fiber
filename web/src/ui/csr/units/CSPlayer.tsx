// Client Side Renderer
import { useEffect, useRef } from 'react';
import { Box } from '@material-ui/core';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';

const CSRenderer = () => {
  const TargetRef = useRef(null!);
  const store = {};
  const futureProps = {
    fbxuri: '/test.fbx',
  };
  useEffect(() => {
    console.log('Ref: ', TargetRef);
    console.log('Dom: ', TargetRef.current);
    const Target: HTMLDivElement = TargetRef.current;
    console.log('width: ', Target.clientWidth);
    console.log('width: ', Target.offsetWidth);
    // initialization
    const width = Target.clientWidth;
    const height = Target.clientHeight;
    // Scene
    const Scene: THREE.Scene = new THREE.Scene();
    Scene.background = new THREE.Color(0xf0f0f0);
    // Renderer
    const Renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
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
    // Light1
    Lights.push(new THREE.HemisphereLight(0xffffff, 0x444444));
    Scene.add(Lights[0]);
    // Light2
    Lights.push(new THREE.DirectionalLight(0xffffff));
    Scene.add(Lights[1]);

    // dat.GUI
    const root = new GUI({ autoPlace: false });
    Target.appendChild(root.domElement);
    root.domElement.style.position = 'absolute';
    root.domElement.style.top = '2px';
    root.domElement.style.right = `2px`;

    animate();
    function animate() {
      requestAnimationFrame(animate);
      if (resizeRendererToDisplaySize(Renderer)) {
        const canvas = Renderer.domElement;
        Camera.aspect = canvas.clientWidth / canvas.clientHeight;
        Camera.updateMatrix();
      }
      //console.log('Target clientWidth: ', Target.clientWidth);
    }
    function resizeRendererToDisplaySize(
      renderer: THREE.WebGLRenderer
    ): boolean {
      /**
       * Three.js公式のレスポンシブ
       * https://threejs.org/manual/#en/responsive
       */
      const canvas = renderer.domElement;
      const width = Target.clientWidth;
      const height = Target.clientHeight;
      const needResize: boolean =
        canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height);
      }
      return needResize;
    }
    console.log('Dom afterthree: ', TargetRef.current);
  }, []);
  return (
    <Box sx={{ width: '100%', position: 'relative' }} ref={TargetRef}></Box>
  );
};

export default CSRenderer;
