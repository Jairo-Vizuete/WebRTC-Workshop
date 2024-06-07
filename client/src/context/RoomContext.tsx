import Peer from "peerjs";
import {
  FunctionComponent,
  ReactNode,
  createContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import socketIOClient, { Socket } from "socket.io-client";
import { v4 as uuidV4 } from "uuid";

const WS = "http://10.101.48.185:8080";

interface RoomContextType {
  ws: Socket;
  me?: Peer;
  stream: MediaStream | undefined;
}

const ws = socketIOClient(WS);

const defaultRoomContext: RoomContextType = {
  ws: ws,
  me: undefined,
  stream: undefined,
};

const RoomContext = createContext<RoomContextType>(defaultRoomContext);

interface RoomProviderProps {
  children: ReactNode;
}

const RoomProvider: FunctionComponent<RoomProviderProps> = ({ children }) => {
  const navigate = useNavigate();

  const [me, setMe] = useState<Peer>();

  const [stream, setStream] = useState<MediaStream>();

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
  }, []);

  return (
    <RoomContext.Provider value={{ ws, me, stream }}>
      {children}
    </RoomContext.Provider>
  );
};

export { RoomProvider, RoomContext };
