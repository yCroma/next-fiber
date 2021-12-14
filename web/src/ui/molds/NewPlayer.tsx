import React, { useEffect, useRef, useCallback, useState } from "react";
import { Grid, Stack, Typography } from "@mui/material";
import NewRenderer from "../molds/NewRenderer";
import PlayBackButton from "../atoms/PlayBackButton";
import ScrubThrough from "../atoms/ScrubThrough";

/**
 * プレイヤーに求めること:
 * - 再生用URLの取得
 * - アニメーションの再生、停止、再生時間の管理(同期)
 */
const NewPlayer = ({ url }: { url: string }) => {
  const [isPlay, setIsPlay] = useState(false);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const ExportDisplayTime = (time: DOMHighResTimeStamp | number) => {
    /**
     * 表示用の数字を作成する関数
     * 小数第3位までの数字を返す
     */
    const newtime = time;
    return newtime.toFixed(3);
  };
  return (
    <Stack>
      <Typography>This is NewPlayer</Typography>
      <Typography>{url}</Typography>
      <NewRenderer
        url={url}
        isPlay={isPlay}
        time={time}
        setIsPlay={setIsPlay}
        setDuration={setDuration}
        setTime={setTime}
      ></NewRenderer>
      <Grid container spacing={0}>
        <Grid item xs={1}>
          <PlayBackButton
            play={isPlay}
            onClick={() => {
              setIsPlay((prev) => !prev);
            }}
          ></PlayBackButton>
        </Grid>
        <Grid item xs={1}>
          <Typography>{ExportDisplayTime(time)}</Typography>
        </Grid>
        <Grid item xs={10}>
          <ScrubThrough
            duration={duration}
            position={time}
            onChange={(_, value) => {
              setIsPlay(false);
              setTime(value);
            }}
          ></ScrubThrough>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default NewPlayer;
