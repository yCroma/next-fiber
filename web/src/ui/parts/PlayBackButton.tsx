import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

const PlayBackButton = ({
  onClick,
  play,
}: {
  onClick: MouseEventHandler;
  play: Boolean;
}) => {
  /**
   * 再生中ならば、停止を促すボタンを表示
   * 停止中ならば、再生を促すボタンを表示
   */
  if (play) {
    return (
      <div onClick={onClick}>
        <FontAwesomeIcon icon={faPause} />
      </div>
    );
  } else {
    return (
      <div onClick={onClick}>
        <FontAwesomeIcon icon={faPlay} />
      </div>
    );
  }
};

export default PlayBackButton;
