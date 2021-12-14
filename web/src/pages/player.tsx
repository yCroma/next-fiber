import type { NextPage } from "next";
import { useState } from "react";
import FBXPlayer from "../components/FBXPlayer";
import NewPlayer from "../components/molds/NewPlayer";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

const Player: NextPage = () => {
  const fbxurl = "/test.fbx";
  const PresetInit = {
    name: "hello, fbx",
  };
  const [preset, SetPreset] = useState(PresetInit);
  return (
    <Stack sx={{ width: "80%", mx: "auto" }}>
      <NewPlayer url={fbxurl} />
      <Stack>
        <FBXPlayer url={fbxurl} preset={preset} />
      </Stack>
    </Stack>
  );
};

export default Player;
