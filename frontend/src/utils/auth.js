// Utility functions for JWT authentication

export const getToken = () => {
  return localStorage.getItem("admin_jwt");
};

export const setToken = (token) => {
  localStorage.setItem("admin_jwt", token);
};

export const removeToken = () => {
  localStorage.removeItem("admin_jwt");
}; 