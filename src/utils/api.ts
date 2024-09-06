import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://restaurant-audit-app-backend-1.onrender.com/api";

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types
export interface User {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  token: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
}

// Function to set the auth token in AsyncStorage and axios headers
export const setAuthToken = async (token: string) => {
  try {
    await AsyncStorage.setItem("authToken", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } catch (error) {
    console.error("Error setting auth token:", error);
  }
};

// Function to get the auth token from AsyncStorage
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem("authToken");
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

// Function to remove the auth token from AsyncStorage and axios headers
export const removeAuthToken = async () => {
  try {
    await AsyncStorage.removeItem("authToken");
    delete api.defaults.headers.common["Authorization"];
  } catch (error) {
    console.error("Error removing auth token:", error);
  }
};

// Function to set the user ID in AsyncStorage
export const setUserId = async (userId: string) => {
  try {
    await AsyncStorage.setItem("userId", userId);
  } catch (error) {
    console.error("Error setting user ID:", error);
  }
};

// Function to get the user ID from AsyncStorage
export const getUserId = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem("userId");
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
};

// Auth functions
export const register = async (userData: {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}): Promise<User> => {
  const response = await api.post<AuthResponse>("/user/register", userData);
  await setAuthToken(response.data.token);
  await setUserId(response.data.userId);
  return response.data;
};

export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<User> => {
  const response = await api.post<AuthResponse>("/user/login", credentials);
  await setAuthToken(response.data.token);
  await setUserId(response.data.userId);
  return response.data;
};

export const logout = async () => {
  await removeAuthToken();
  await AsyncStorage.removeItem("userId");
};

export interface UserInfo {
  name: string;
  email: string;
  phoneNumber: string;
  memberSince: string;
  lastLogin: string;
  loginCount: number;
}

export const getUserDetails = async (userId: string): Promise<UserInfo> => {
  const response = await api.get<UserInfo>(`/user/user-details/${userId}`);
  return response.data;
};

export default api;
