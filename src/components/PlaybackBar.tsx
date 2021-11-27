import { useEffect } from "react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";

const multiply1000 = (ms: number) => ms * 1000;

const PlaybackBar = (props) => {
  const model = props.time();
  console.log(model.animations);
  return (
    <Slider
      aria-label="slider-ex-1"
      defaultValue={10}
      step={1}
      min={0}
      max={1000}
      onChange={(val) => console.log(val)}
    >
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
    </Slider>
  );
};

export default PlaybackBar;
