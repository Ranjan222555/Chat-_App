import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "devlopment" ? "http://localhost:5001" : "/";

export const UseAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLogingIn: false,
  isUpdatingProfile: false,
  onlineUser: [],
  isCheckingAuth: true,
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      // console.log(res, "res of checkAuth in useauthStore ");

      set({ authUser: res.data });

      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/auth/signup", data);
      console.log(response, "response of signup in useauthStote");

      set({ authUser: response.data });
      toast.success("Account Create Successfully!!");

      get().connectSocket();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLogingIn: true });
    try {
      const response = await axiosInstance.post("/auth/login", data);
      console.log(response, "responce of login useauthstore");

      set({ authUser: response.data });
      toast.success("LogIn Successfully!!");

      get().connectSocket();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      set({ isLogingIn: false });
    }
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      console.log(response);

      set({ authUser: null });
      toast.success("LogOut Successfully!!");

      get().disConnectSocket();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put("/auth/update-profile", data);
      console.log(response, "responce of updateProfile useauthstore");

      set({ authUser: response.data });
      toast.success("updateProfile Successfully!!");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUser", (userIds) => {
      set({ onlineUser: userIds });
    });
  },
  disConnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect();
  },
}));
