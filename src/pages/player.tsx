import type { NextPage } from "next";
import { useState } from "react";
import FBXPlayer from "../components/FBXPlayer";

import Grid from "@mui/material/Grid";

const Player: NextPage = () => {
  const fbxurl = "/test.fbx";
  const PresetInit = {
    name: "hello, fbx",
  };
  const [preset, SetPreset] = useState(PresetInit);
  return (
    <Grid container justifyContent="center">
      <div w="80%" m="auto">
        <FBXPlayer url={fbxurl} preset={preset} />
      </div>
    </Grid>
  );
};

export default Player;
