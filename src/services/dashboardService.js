import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "./endpoints";

export const getDashboardData = async () => {
  return apiClient(API_ENDPOINTS.DASHBOARD.GET);
};

export const getProfile = async () => {
  return apiClient(API_ENDPOINTS.USER.PROFILE);
};

export const updateProfile = async (payload) => {
  return apiClient(API_ENDPOINTS.USER.PROFILE, {
    method: "PUT",
    body: payload,
  });
};

export const getSettings = async () => {
  return apiClient(API_ENDPOINTS.USER.SETTINGS);
};

export const updateSettings = async (payload) => {
  return apiClient(API_ENDPOINTS.USER.SETTINGS, {
    method: "PUT",
    body: payload,
  });
};