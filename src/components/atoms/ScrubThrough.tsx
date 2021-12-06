import Slider from "@mui/material/Slider";

const ScrubThrough = ({
  duration,
  position,
  onChange,
}: {
  duration: number;
  position: number;
  onChange: any;
}) => {
  return (
    <Slider
      defaultValue={0}
      value={position}
      step={0.001}
      min={0}
      max={duration}
      valueLabelDisplay="auto"
      onChange={onChange}
    ></Slider>
  );
};

export default ScrubThrough;
