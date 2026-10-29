import api from "../api/Axios";


export const signup = async (userData) => {
  const response = await api.post(
    "/api/users/create-user",
    userData
  );

  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post(
    "/api/users/user-login",
    credentials
  );

  return response.data;
};

export const logout = async () => {
  const response = await api.post("/api/users/user-logout");

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/api/users/me");

  return response.data;
};