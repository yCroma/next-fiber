import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import useAnimation from "../customhooks/useAnimation";

import { chakra } from "@chakra-ui/react";
import Renderer from "./blocks/Renderer";
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
  //const timeRef = useRef<Time>({});
  const [action, setAction] = useState<THREE.AnimationAction>();

  return (
    <>
      <h2>This is FBXPlayer</h2>
      <h3>{url}</h3>
      <PlaybackBar time={() => modelRef.current}></PlaybackBar>
      <Renderer url={url} />
      <h4>{time}</h4>
    </>
  );
};

export default FBXPlayer;
