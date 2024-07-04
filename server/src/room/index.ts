import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";

const rooms: Record<string, string[]> = {};

interface IRoomParams {
  roomId: string;
  peerId: string;
}

export const roomHandler = (socket: Socket) => {
  const createRoom = () => {
    const roomId = uuidV4();

    rooms[roomId] = [];

    socket.emit("room-created", {
      roomId,
    });

    console.log(`user created the room: ${roomId}`);
  };

  const joinRoom = ({ roomId, peerId }: IRoomParams) => {
    if (rooms[roomId]) {
      console.log(`user ${socket.id} joined the room: ${roomId}`);

      rooms[roomId].push(peerId);

      socket.join(roomId);

      socket.to(roomId).emit("user-joined", { peerId });

      socket.emit("get-users", {
        roomId,
        participants: rooms[roomId],
      });
    }
    socket.on("disconnect", () => {
      console.log(`user left the room: ${peerId}`);
      leaveRoom({ roomId, peerId });
    });
    // else {
    //   console.warn(`Room ${roomId} does not exist.`);
    //   socket.emit("error", "Room does not exist.");
    // }
  };

  const leaveRoom = ({ peerId, roomId }: IRoomParams) => {
    rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);
    socket.to(roomId).emit("user-disconnected", peerId);
    // if (rooms[roomId]) {
    //   rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);

    //   socket.to(roomId).emit("user-disconnected", peerId);

    //   if (rooms[roomId].length === 0) {
    //     delete rooms[roomId];
    //     console.log(`Room ${roomId} deleted as it is now empty.`);
    //   }
    // } else {
    //   console.warn(`Cannot leave room ${roomId} as it does not exist.`);
    // }
  };

  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
};
