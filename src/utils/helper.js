// utils/tokenUtils.js
import { jwtDecode } from "jwt-decode";

export function isTokenValid(token) {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
}

export function getTokenExpiration(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000; // ms
  } catch (error) {
    return null;
  }
}
