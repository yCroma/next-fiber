import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

const PlayBackButton = ({
  onClick,
  play,
}: {
  onClick: MouseEventHandler;
  play: Boolean;
}) => {
  /*
   * 再生状態がtrueでpropsしてくる
   * 再生時にstop、停止時にplayが表示されるようにしている
   */
  if (!play) {
    return (
      <div onClick={onClick}>
        <FontAwesomeIcon icon={faPlay} />
      </div>
    );
  } else {
    return (
      <div onClick={onClick}>
        <FontAwesomeIcon icon={faPause} />
      </div>
    );
  }
};

export default PlayBackButton;
