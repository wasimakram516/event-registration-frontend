import {jwtDecode as jwt_decode} from "jwt-decode";
import { getAccessToken } from "./tokenService";

export const decodeToken = () => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    return jwt_decode(token); // Decode the token to get the payload
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};
