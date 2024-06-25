import { createContext } from "react";

export const Authcontext = createContext({
  isLoggedIn: false,
  userId:null,
  token:null,
  login: () => {},
  logout: () => {},
});
