import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

import { chakra } from "@chakra-ui/react";

interface props {
  url: string;
  preset: JSON;
}

interface model {
  model?: THREE.Group;
  mixer?: THREE.AnimationMixer;
  animations?: Array<THREE.AnimationClip>;
  actions?: Array<THREE.AnimationAction>;
}

interface ThreeParams {
  renderer?: THREE.Renderer;
  camera?: THREE.PerspectiveCamera;
  scene?: THREE.Scene;
}

const Canvas = chakra("canvas");

const FBXPlayer = ({ url, preset }: props) => {
  const canvasRef = useRef();
  const threeRef = useRef<ThreeParams>({});
  const modelRef = useRef<model>({});
  console.log(preset);

  useEffect(() => {
    console.log(canvasRef.current);
    console.log("model", modelRef);
    const canvas = canvasRef.current;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    threeRef.current.renderer = renderer;

    const scene = new THREE.Scene();
    threeRef.current.scene = scene;

    // カメラを作成
    const camera = new THREE.PerspectiveCamera(45, width / height);
    camera.position.set(0, 0, +100);
    threeRef.current.camera = camera;
    scene.add(camera);

    const controls = new OrbitControls(camera, canvas);

    // light
    const AmbientLight = new THREE.AmbientLight(0xffffff, 4.0);
    scene.add(AmbientLight);

    // 3Dモデルをロード
    const loader = new FBXLoader();
    loader.load(url, (model: THREE.Group) => {
      modelRef.current.model = model;
      modelRef.current.mixer = new THREE.AnimationMixer(model);
      modelRef.current.animations = model.animations;
      // 今回の開発では、1番目に登録されているアニメーションのみに対応する
      modelRef.current.actions = [
        modelRef.current.mixer.clipAction(modelRef.current.animations[0]),
      ];
      modelRef.current.actions[0].play;
      console.log(model);
      scene.add(model);
    });
    // resizehandle
    const resizehandle = () => {
      renderer.setSize(
        canvasRef.current.clientWidth,
        canvasRef.current.clientHeight,
        false
      );
      camera.aspect =
        canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix;
    };

    // animate
    const animate = () => {
      resizehandle();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
  });

  return (
    <>
      <h2>This is FBXPlayer</h2>
      <h3>{url}</h3>
      <Canvas w="100%" ref={canvasRef}></Canvas>
    </>
  );
};

export default FBXPlayer;
