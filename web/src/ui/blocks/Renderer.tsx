import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import useAnimation from "../../customhooks/useAnimation";

import rafSchd from "raf-schd";

interface props {
  url: string;
  setTime: Function;
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

const Renderer = ({
  clock,
  play,
  url,
  time,
  setClock,
  setDuration,
  setTime,
  setPlay,
}: {
  clock: any;
  play: boolean;
  url: string;
  time: number;
  setClock: Function;
  setDuration: Function;
  setTime: Function;
  setPlay: Function;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const threeRef = useRef<ThreeParams>({});
  const modelRef = useRef<model>({});

  const clockRef = useRef({});
  useEffect(() => {
    //
    const clock = new THREE.Clock();
    //clockRef.current = new THREE.Clock();
    setClock(clock);
    //
    const canvas = canvasRef.current || document.createElement("canvas");
    const store = threeRef.current;
    // renderer
    store.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    // screen
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
      setDuration(modelRef.current.animations![0].duration);
      modelRef.current.actions[0].play();
      setPlay(true);
      store.scene!.add(model);
      // モデルを読み込んだ際に時間関連のデータも初期化
      // timeRef.current.time = 0;
      // timeRef.current.step = 0.001;
      // timeRef.current.start = 0;
      // timeRef.current.end = modelRef.current.animations[0].duration;
    });
  }, []);
  // 解像度用のresize
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
      if (play) {
        modelRef.current.actions![0].paused = false;
        modelRef.current.mixer.update(deltaTime);
        setTime(modelRef.current.actions![0].time);
      } else {
        modelRef.current.actions![0].time = time;
        modelRef.current.mixer.setTime(time);
      }
    }
    threeRef.current.renderer!.render(
      threeRef.current.scene!,
      threeRef.current.camera!
    );
  };

  useAnimation(animate, [play, time]);
  return (
    <>
      <canvas w="100%" ref={canvasRef}></canvas>
    </>
  );
};

export default Renderer;
