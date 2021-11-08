import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import useAnimation from "../customhooks/useAnimation";

import { chakra } from "@chakra-ui/react";
import PlaybackBar from "./PlaybackBar";

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
  const canvasRef = useRef<HTMLCanvasElement>();
  const threeRef = useRef<ThreeParams>({});
  const modelRef = useRef<model>({});

  useEffect(() => {
    const canvas = canvasRef.current;
    const store = threeRef.current;
    // renderer
    store.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    // scene
    store.scene = new THREE.Scene();
    // camera
    store.camera = new THREE.PerspectiveCamera(
      45,
      canvas!.clientWidth / canvas!.clientHeight
    );
    store.camera.position.set(0, 0, +100);
    store.scene.add(store.camera);
    // controls
    const controls = new OrbitControls(store.camera, canvas);
    // light
    const AmbientLight = new THREE.AmbientLight(0xffffff, 4.0);
    store.scene.add(AmbientLight);

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
      modelRef.current.actions[0].play();
      store.scene.add(model);
    });
  });

  const resizehandle = () => {
    threeRef.current.renderer.setSize(
      canvasRef.current!.clientWidth,
      canvasRef.current!.clientHeight,
      false
    );
    threeRef.current.camera.aspect =
      canvasRef.current!.clientWidth / canvasRef.current!.clientHeight;
    threeRef.current.camera.updateProjectionMatrix;
  };

  const animate = (deltaTime) => {
    resizehandle();
    if (modelRef.current.mixer) {
      modelRef.current.mixer.update(deltaTime);
    }
    threeRef.current.renderer.render(
      threeRef.current.scene,
      threeRef.current.camera
    );
  };

  useAnimation(animate);

  return (
    <>
      <h2>This is FBXPlayer</h2>
      <h3>{url}</h3>
      <Canvas w="100%" ref={canvasRef}></Canvas>
      <PlaybackBar></PlaybackBar>
    </>
  );
};

export default FBXPlayer;
