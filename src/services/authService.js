import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "./endpoints";

export const loginUser = async (payload) => {
  return apiClient(API_ENDPOINTS.AUTH.LOGIN, {
    method: "POST",
    body: payload,
  });
};

export const registerUser = async (payload) => {
  return apiClient(API_ENDPOINTS.AUTH.REGISTER, {
    method: "POST",
    body: payload,
  });
};

export const logoutUser = async () => {
  return apiClient(API_ENDPOINTS.AUTH.LOGOUT, {
    method: "POST",
  });
};

export const getCurrentUser = async () => {
  return apiClient(API_ENDPOINTS.USER.PROFILE);
};
