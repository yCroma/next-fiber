import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

interface props {
  url: string;
  preset: JSON;
}

const FBXPlayer = ({ url, preset }: props) => {
  const canvasRef = useRef();
  console.log(preset);

  useEffect(() => {
    console.log(canvasRef.current);
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

    // // 箱を作成
    // const geometry = new THREE.BoxGeometry(400, 400, 400);
    // const material = new THREE.MeshNormalMaterial();
    // const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);

    // 3Dモデルをロード
    const loader = new FBXLoader();
    loader.load(url, (model) => {
      scene.add(model);
    });

    // animate
    const animate = () => {
      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;

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
