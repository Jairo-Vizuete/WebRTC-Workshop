import { FC, useContext } from "react";
import { RoomContext } from "../context/RoomContext";

export const JoinButton: FC = () => {
  const roomContextType = useContext(RoomContext);

  const joinRoom = () => {
    roomContextType?.ws.emit("create-room");
  };

  return (
    <button
      className="bg-green-500 rounded py-3 px-8 hover:bg-green-700"
      onClick={joinRoom}
    >
      Start new meeting
    </button>
  );
};

export default JoinButton;
