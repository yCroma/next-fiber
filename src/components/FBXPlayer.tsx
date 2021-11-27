import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import useAnimation from "../customhooks/useAnimation";

import { chakra } from "@chakra-ui/react";
import PlaybackBar from "./PlaybackBar";

interface props {
  url: string;
  preset: object;
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

interface Time {
  step?: number;
  time?: number;
  start?: number;
  end?: number;
  preset?: {
    status: boolean;
    start: number;
    end: number;
  };
}

const Canvas = chakra("canvas");

const FBXPlayer = ({ url, preset }: props) => {
  const [time, setTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const threeRef = useRef<ThreeParams>({});
  const modelRef = useRef<model>({});
  //const timeRef = useRef<Time>({});
  const [action, setAction] = useState<THREE.AnimationAction>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const store = threeRef.current;
    // renderer
    store.renderer = new THREE.WebGLRenderer({
      canvas: canvas!,
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
    const controls = new OrbitControls(store.camera, canvas!);
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
      store.scene!.add(model);
      // モデルを読み込んだ際に時間関連のデータも初期化
      // timeRef.current.time = 0;
      // timeRef.current.step = 0.001;
      // timeRef.current.start = 0;
      // timeRef.current.end = modelRef.current.animations[0].duration;
    });
  });

  const resizehandle = () => {
    threeRef.current.renderer!.setSize(
      canvasRef.current!.clientWidth,
      canvasRef.current!.clientHeight,
      false
    );
    threeRef.current.camera!.aspect =
      canvasRef.current!.clientWidth / canvasRef.current!.clientHeight;
    threeRef.current.camera!.updateProjectionMatrix;
  };

  const animate = (deltaTime: DOMHighResTimeStamp) => {
    resizehandle();
    if (modelRef.current.mixer) {
      modelRef.current.mixer.update(deltaTime);
      //console.log(modelRef.current.actions![0].time);
      //setTime(modelRef.current.actions![0].time);
    }
    threeRef.current.renderer!.render(
      threeRef.current.scene!,
      threeRef.current.camera!
    );
  };

  useAnimation(animate);

  return (
    <>
      <h2>This is FBXPlayer</h2>
      <h3>{url}</h3>
      <Canvas w="100%" ref={canvasRef}></Canvas>
      <PlaybackBar time={() => modelRef.current}></PlaybackBar>
      <h4>{time}</h4>
    </>
  );
};

export default FBXPlayer;
