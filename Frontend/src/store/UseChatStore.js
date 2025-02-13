import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { UseAuthStore } from "./UseAuthStore.js";

export const useChatStore = create((set, get) => ({
  message: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,

  getUser: async () => {
    set({ isUserLoading: true });
    try {
      const responce = await axiosInstance.get("/message/users");

      // console.log("Users response:", responce.data);
      set({ users: responce.data }); // i add this []
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message); // i add this  || ""
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessage: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const responce = await axiosInstance.get(`/message/${userId}`);
      set({ message: responce.data });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messagedata) => {
    const { selectedUser, message } = get();
    try {
      const responce = await axiosInstance.post(
        `/message/send/${selectedUser._id}`, // type mistake `/message/send/${selectedUser._id,messagedata`}  to new one
        messagedata
      );
      set({ message: [...message, responce.data] });
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  },

  MessageBetweenUsers: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = UseAuthStore.getState().socket;

    // console.log(socket);

    socket.on("newMessage", (newMessage) => {
      // if (newMessage.senderId !== selectedUser._id) return;

      //other way same work in readable
      const isSendmessagefromSelectedUser =
        newMessage.senderId === selectedUser._id; // message between users
      if (!isSendmessagefromSelectedUser) return;

      set({ message: [...get().message, newMessage] });
    });
  },

  NomessageBetweenUser: () => {
    const socket = UseAuthStore.getState().socket;
    socket.off("newMessage");
  },

  // if there is any issue code here
  setSelecteduser: (selectedUser) => set({ selectedUser }),
}));
