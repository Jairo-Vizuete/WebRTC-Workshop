import Peer from "peerjs";
import {
  FunctionComponent,
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import socketIOClient, { Socket } from "socket.io-client";
import { v4 as uuidV4 } from "uuid";

import { PeerState, peersReducer } from "./peerReducer";
import { addPeerAction, removePeerAction } from "./peerActions";

const WS = "http://192.168.100.2:8080";

interface RoomContextType {
  ws: Socket;
  me?: Peer;
  stream: MediaStream | undefined;
  // peers: { [id: string]: MediaStream };
  peers: PeerState;
}

const ws = socketIOClient(WS);

const defaultRoomContext: RoomContextType = {
  ws: ws,
  me: undefined,
  stream: undefined,
  peers: {},
};

const RoomContext = createContext<RoomContextType>(defaultRoomContext);

interface RoomProviderProps {
  children: ReactNode;
}

const RoomProvider: FunctionComponent<RoomProviderProps> = ({ children }) => {
  const navigate = useNavigate();

  const [me, setMe] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();

  const [peers, dispatch] = useReducer(peersReducer, {});

  const enterRoom = ({ roomId }: { roomId: string }) => {
    console.log({ roomId });
    navigate(`/room/${roomId}`);
  };

  const getUsers = ({
    roomId,
    participants,
  }: {
    roomId: string;
    participants: string[];
  }) => {
    console.log({ roomId, participants });
  };

  const removePeer = (peerId: string) => {
    dispatch(removePeerAction(peerId));
  };

  useEffect(() => {
    const meId = uuidV4();

    const peer = new Peer(meId);
    setMe(peer);

    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          console.log(stream);
          setStream(stream);
        });
    } catch (error) {
      console.log(error);
    }

    ws.on("room-created", enterRoom);
    ws.on("get-users", getUsers);
    ws.on("user-disconnected", removePeer);
  }, []);

  useEffect(() => {
    if (!me) return;
    if (!stream) return;

    ws.on("user-joined", ({ peerId }) => {
      const call = me.call(peerId, stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerAction(peerId, peerStream));
      });
    });

    me.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerAction(call.peer, peerStream));
      });
    });
  }, [me, stream]);

  console.log({ peers });

  return (
    <RoomContext.Provider value={{ ws, me, stream, peers }}>
      {children}
    </RoomContext.Provider>
  );
};

export { RoomProvider, RoomContext };
