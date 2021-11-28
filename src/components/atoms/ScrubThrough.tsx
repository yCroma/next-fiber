import { useEffect } from "react";
import Slider from "@mui/material/Slider";
// const multiply1000 = (ms: number) => ms * 1000;
const multiply1000 = (ms: number) => {
  console.log(ms);
  return ms * 1000;
};

const ScrubThrough = ({ time }: { time: DOMHighResTimeStamp }) => {
  return (
    <Slider
      defaultValue={0.01}
      step={0.001}
      min={0}
      max={5}
      valueLabelDisplay="auto"
    ></Slider>
  );
};

export default ScrubThrough;
