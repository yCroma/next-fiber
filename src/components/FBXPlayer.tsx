import React, { useState } from "react";
import * as THREE from "three";

import Renderer from "./blocks/Renderer";
import ScrubThrough from "./atoms/ScrubThrough";
import PlayBackButton from "./atoms/PlayBackButton";

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

const FBXPlayer = ({ url, preset }: { url: string; preset: object }) => {
  const [time, setTime] = useState<DOMHighResTimeStamp>(0);
  const [play, setPlay] = useState<Boolean>(false);
  const [action, setAction] = useState<THREE.AnimationAction>();

  return (
    <>
      <h2>This is FBXPlayer</h2>
      <h3>{url}</h3>
      <Renderer url={url} setTime={setTime} />
      <h4>{time}</h4>
        <PlayBackButton setPlay={setPlay} play={play} />
      <ScrubThrough time={time}></ScrubThrough>
    </>
  );
};

export default FBXPlayer;
