import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

interface props {
  url: string;
  preset: JSON;
}

interface model {
  model: THREE.Group;
  mixer: THREE.AnimationMixer;
  animations: Array<THREE.AnimationClip>;
  actions: Array<THREE.AnimationAction>;
}

const FBXPlayer = ({ url, preset }: props) => {
  const canvasRef = useRef();
  const modelRef = useRef<model>();
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

    const scene = new THREE.Scene();

    // カメラを作成
    const camera = new THREE.PerspectiveCamera(45, width / height);
    camera.position.set(0, 0, +100);
    scene.add(camera);

    const controls = new OrbitControls(camera, canvas);

    // light
    const AmbientLight = new THREE.AmbientLight(0xffffff, 4.0);
    scene.add(AmbientLight);

    // 3Dモデルをロード
    const loader = new FBXLoader();
    loader.load(url, (model: THREE.Group) => {
      console.log(model);
      scene.add(model);
    });

    // animate
    const animate = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
  });

  return (
    <>
      <h2>This is FBXPlayer</h2>
      <h3>{url}</h3>
      <canvas ref={canvasRef}></canvas>
    </>
  );
};

export default FBXPlayer;
