import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  users: [],
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  leetCodeData: null,

  signup: async (
    email,
    password,
    name,
    role,
    classroom,
    prn,
    confirmPassword,
    rollNo
  ) => {
    set({ isLoading: true, error: null });

    console.log(
      email,
      password,
      name,
      role,
      classroom,
      prn,
      confirmPassword,
      rollNo
    );
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
        role,
        classroom,
        prn,
        confirmPassword,
        rollNo,
      });
      set({
        user: JSON.parse(response.data.user),
        isAuthenticated: true,
        isLoading: false,
      });
      toast.success(response.data.message);
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password, role) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
        role,
      });
      set({
        isAuthenticated: true,
        user: JSON.parse(response.data.user),
        error: null,
        isLoading: false,
      });
      toast.success(response.data.message);
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
      toast.success("User logout successfully");
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: JSON.parse(response.data.user),
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
      toast.success(response.data.message);
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response.data.message || "Error sending reset password email",
      });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        user: JSON.parse(response.data.user),
        isAuthenticated: true,
        isLoading: false,
      });
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  resetPassword: async (token, password, confirmPassword) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
        confirmPassword,
      });
      set({ message: response.data.message, isLoading: false });
      toast.success(response.data.message);
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting password",
      });
      throw error;
    }
  },
  fetchAllStudents: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/student`); // Adjust the endpoint as necessary
      set({ users: response.data.users || [], isLoading: false }); // Ensure it initializes correctly
      // toast.success("Users fetched successfully");
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching users",
        isLoading: false,
      });
      throw error;
    }
  },

  saveTimeToDatabase: async (timeInSeconds, expResult) => {
    try {
      const response = await axios.post(`${API_URL}/savetime`, {
        time: timeInSeconds,
        expResult,
      }); // Use Axios to send the time to the server
      console.log("Time saved successfully:", response.data);
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error saving time",
        isLoading: false,
      });
      throw error;
    }
  },

  fetchLeetCodeData: async (username) => {
    set({ isLoading: true, error: null });
    try {
      console.log(username);
      const response = await axios.post(`${API_URL}/leetcode/${username}`);
      set({ leetCodeData: response.data, isLoading: false });
      toast.success("LeetCode data fetched successfully!");
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error fetching LeetCode data",
      });
      toast.error(
        error.response?.data?.message || "Error fetching LeetCode data"
      );
      throw error;
    }
  },
}));
