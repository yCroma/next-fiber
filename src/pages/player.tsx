import type { NextPage } from "next";
import { useState } from "react";
import FBXPlayer from "../components/FBXPlayer";

import { Box } from "@chakra-ui/react";

const Player: NextPage = () => {
  const fbxurl = "/test.fbx";
  const PresetInit = {
    name: "hello, fbx",
  };
  const [preset, SetPreset] = useState(PresetInit);
  return (
    <>
      <h1>hello</h1>
      <Box w="80%" m="auto">
        <FBXPlayer url={fbxurl} preset={preset} />
      </Box>
    </>
  );
};

export default Player;
