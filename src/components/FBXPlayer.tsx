import React, { useState } from "react";
import * as THREE from "three";

import { chakra } from "@chakra-ui/react";
import Renderer from "./blocks/Renderer";
import PlaybackBar from "./PlaybackBar";
import PlayBackButton from "./atoms/PlayBackButton";

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

const FBXPlayer = ({ url, preset }: { url: string; preset: object }) => {
  const [time, setTime] = useState<DOMHighResTimeStamp>(0);
  const [play, setPlay] = useState<Boolean>(false);
  const [action, setAction] = useState<THREE.AnimationAction>();

  return (
    <>
      <h2>This is FBXPlayer</h2>
      <h3>{url}</h3>
      <PlaybackBar time={() => modelRef.current}></PlaybackBar>
      <Renderer url={url} setTime={setTime} />
      <h4>{time}</h4>
        <PlayBackButton setPlay={setPlay} play={play} />
    </>
  );
};

export default FBXPlayer;
