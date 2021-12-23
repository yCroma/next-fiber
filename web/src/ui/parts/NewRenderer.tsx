import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

//import useAnimation from "../../customhooks/useAnimation";
/**
 * レンダラーに求めること
 * 1.与えられたURLを取得
 * 2.URLのアニメーションをロード
 * 3.アニメーションの更新
 * 4.再生時間からのアニメーションの再生
 */

interface ThreeStore {
  Clock?: THREE.Clock;
  Renderer?: THREE.WebGLRenderer;
  Scene?: THREE.Scene;
  Camera?: THREE.PerspectiveCamera;
  Controls?: OrbitControls;
  Lights?: Array<THREE.Light>;
  Model?: THREE.Group;
  Mixer?: THREE.AnimationMixer;
  Animations?: Array<THREE.AnimationClip>;
  Actions?: Array<THREE.AnimationAction>;
  isPlay?: boolean;
  time?: number;
}

const loader = new FBXLoader();

const NewRenderer = ({
  url,
  isPlay,
  time,
  setDuration,
  setIsPlay,
  setTime,
}: {
  url: string;
  isPlay: boolean;
  time: number;
  setDuration: Function;
  setIsPlay: Function;
  setTime: Function;
}) => {
  const CanvasRef = useRef(null!);
  const StoreRef = useRef<ThreeStore>({});
  StoreRef.current.isPlay = isPlay;
  StoreRef.current.time = time;

  // init parameter
  function init() {
    const Canvas = CanvasRef.current;
    const Store = StoreRef.current;
    // width, height
    const width = Canvas.clientWidth;
    const height = Canvas.clientHeight;
    // Clock
    Store.Clock = new THREE.Clock();
    // Renderer
    Store.Renderer = new THREE.WebGLRenderer({
      canvas: Canvas,
    });
    Store.Renderer.setPixelRatio(window.devicePixelRatio);
    Store.Renderer.setSize(width, height);

    // Scene
    Store.Scene = new THREE.Scene();
    Store.Scene.background = new THREE.Color(0xf0f0f0);
    //Store.Scene.fog = new THREE.Fog(0xf0f0f0, 50, 50);

    // Camera
    Store.Camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    Store.Camera.position.set(0, 10, 50);
    Store.Camera.lookAt(0, 40, 0);
    Store.Scene.add(Store.Camera);
    // Controls
    Store.Controls = new OrbitControls(Store.Camera, Store.Renderer.domElement);
    Store.Controls.target.set(0, 0, 0);
    Store.Controls.update();

    // Lights
    Store.Lights = [];
    // Light1
    Store.Lights.push(new THREE.HemisphereLight(0xffffff, 0x444444));
    Store.Scene.add(Store.Lights[0]);
    // Light2
    Store.Lights.push(new THREE.DirectionalLight(0xffffff));
    Store.Scene.add(Store.Lights[1]);
  }

  function loadmodel() {
    const Store = StoreRef.current;
    console.log(Store);
    loader.load(url, (model) => {
      Store.Model = model;
      Store.Scene!.add(Store.Model);
      Store.Mixer = new THREE.AnimationMixer(model);
      Store.Animations = model.animations;
      Store.Actions = [];
      Store.Animations.forEach((clip) => {
        Store.Actions!.push(Store.Mixer!.clipAction(clip));
      });
      Store.Actions[0].play();
      setIsPlay(true);
      setDuration(Store.Animations[0].duration);
    });
  }

  let deltaTime;
  function animate() {
    deltaTime = StoreRef.current.Clock!.getDelta();
    StoreRef.current.Controls!.update();
    if (StoreRef.current.Mixer) {
      /**
       * モデル読み込み時のundefined対策
       */
      if (StoreRef.current.isPlay !== undefined) {
        /**
         * ロード時のundefined対策
         */
        if (StoreRef.current.isPlay) {
          StoreRef.current.Mixer.update(deltaTime);
        } else {
          /**
           * スクラブスルーのonchangeをロックしてしまうので、
           * ここのsetTimeは必須
           */
          setTime(StoreRef.current.time);
          StoreRef.current.Mixer.setTime(StoreRef.current.time!);
        }
        /**
         * 再生時間はシークバーでも操作するため
         * IsPlayの真偽値に関係なく更新する
         */
        setTime(StoreRef.current.Actions![0].time);
      }
    }
    StoreRef.current.Renderer!.render(
      StoreRef.current.Scene,
      StoreRef.current.Camera
    );
    requestAnimationFrame(animate);
  }

  // active animation
  useEffect(() => {
    init();
    loadmodel();
    animate();
  }, []);

  return <canvas ref={CanvasRef}></canvas>;
};

export default NewRenderer;
