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
  const [play, setPlay] = useState<boolean>(false);
  const [action, setAction] = useState<THREE.AnimationAction>();

  return (
    <>
      <h2>This is FBXPlayer</h2>
      <h3>{url}</h3>
      <h4>{time}</h4>
      <Renderer url={url} play={play} setTime={setTime} setPlay={setPlay} />
      <ScrubThrough time={time}></ScrubThrough>
        <PlayBackButton onClick={() => setPlay(!play)} play={play} />
    </>
  );
};

export default FBXPlayer;
