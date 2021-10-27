import type { NextPage } from "next";
import { useState } from "react";
import FBXPlayer from "../components/FBXPlayer";

const Player: NextPage = () => {
  const fbxurl = "/test.fbx";
  const PresetInit = {
    name: "hello, fbx",
  };
  const [preset, SetPreset] = useState(PresetInit);
  return (
    <>
      <h1>hello</h1>
      <FBXPlayer url={fbxurl} preset={preset} />
    </>
  );
};

export default Player;
