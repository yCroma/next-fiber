import React, { useReducer, useCallback, useState } from "react";
import useToggle from "../../customhooks/useToggle";
import useAnimation from "../../customhooks/useAnimation";

import Renderer from "../units/Renderer";
import ScrubThrough from "../parts/ScrubThrough";
import PlayBackButton from "../parts/PlayBackButton";

import { Grid, Typography } from "@mui/material";

const FBXPlayer = ({ url, preset }: { url: string; preset: object }) => {
  const [time, setTime] = useState<DOMHighResTimeStamp | number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [play, setPlay] = useState(false);

  const [clock, setClock] = useState(null);

  const ExportDisplayTime = (time: DOMHighResTimeStamp | number) => {
    /**
     * 表示用の数字を作成する関数
     * 小数第3位までの数字を返す
     */
    const newtime = time;
    return newtime.toFixed(3);
  };

  return (
    <>
      <h2>This is FBXPlayer</h2>
      <h3>{url}</h3>
      <Renderer
        clock={clock}
        url={url}
        time={time}
        play={play}
        setClock={setClock}
        setDuration={setDuration}
        setTime={setTime}
        setPlay={setPlay}
      />
      <ScrubThrough
        duration={duration}
        position={time}
        onChange={(_, value) => {
          setTime(value);
        }}
      ></ScrubThrough>
      <Grid container>
        <PlayBackButton
          onClick={() => setPlay((value) => !value)}
          play={play}
        />
        <Typography>{ExportDisplayTime(time)}</Typography>
      </Grid>
    </>
  );
};

export default FBXPlayer;
