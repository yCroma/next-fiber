import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

import { Box } from "@chakra-ui/react";

const PlayBackButton = ({
  setPlay,
  play,
}: {
  setPlay: Function;
  play: Boolean;
}) => {
  /*
   * 再生状態がtrueでpropsしてくる
   * 再生時にstop、停止時にplayが表示されるようにしている
   */
  if (!play) {
    return (
      <Box onClick={() => setPlay(!play)}>
        <FontAwesomeIcon icon={faPlay} />
      </Box>
    );
  } else {
    return (
      <Box onClick={onClick}>
        <FontAwesomeIcon icon={faPause} />
      </Box>
    );
  }
};

export default PlayBackButton;
