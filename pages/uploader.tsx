import type { NextPage } from "next";
import { Suspense, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "@react-three/drei";

const Scene = () => {
  const fbx = useLoader(FBXLoader, `/test.fbx`);
  // useFrame(({ clock }) => {
  //   const a = clock.getElapsedTime();
  //   console.log(a);
  // });

  return <primitive object={fbx} />;
};

const Uploader: NextPage = () => {
  return (
    <div>
      <h1>Hello World</h1>
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          <Scene />
        </Suspense>
      </Canvas>
      <h2>hello</h2>
    </div>
  );
};

export default Uploader;
