import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import VideoPlayer from "../components/VideoPlayer";
import { PeerState } from "../context/peerReducer";

const Room = () => {
  const { id } = useParams();
  const { ws, me, stream, peers } = useContext(RoomContext);
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
      <div className="grid grid-cols-4 gap-4">
        {stream && <VideoPlayer stream={stream} />}
        {Object.values(peers as PeerState).map((peer, index) => (
          <VideoPlayer key={index} stream={peer.stream} />
        ))}

        {/* {stream ? (
          <div className="grid grid-cols-4 gap-4">
            <VideoPlayer stream={stream} />
            {Object.values(peers as PeerState).map((peer) => (
              <VideoPlayer stream={peer.stream} />
            ))}
          </div>
        ) : (
          <p>Loading stream...</p>
        )} */}
      </div>
    </div>
  );
};

export default Room;
