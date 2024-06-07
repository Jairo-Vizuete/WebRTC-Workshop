import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import VideoPlayer from "../components/VideoPlayer";

const Room = () => {
  const { id } = useParams();
  const { ws, me, stream } = useContext(RoomContext);
  console.log(stream);
  useEffect(() => {
    if (me) {
      ws.emit("join-room", {
        roomId: id,
        peerId: me.id,
      });
    }
    console.log({ roomId: id, peerId: me?.id });
  }, [id, me, ws]);

  return (
    <div>
      Room id: {id}
      <div>
        {stream ? (
          <VideoPlayer stream={stream} />
        ) : (
          <p>Loading stream...</p> // Puedes renderizar cualquier mensaje o componente aquí
        )}
      </div>
    </div>
  );
};

export default Room;
