import { atom } from "recoil";

export const authIdState = atom({
  key: "authId",
  default: {
    // DB情報
    id: "",
  },
});

export const authNameState = atom({
  key: "authName",
  default: {
    name: "",
  },
});

export const authPicrureState = atom({
  key: "authPicrure",
  default: {
    picrure: "",
  },
});

export const authTokenState = atom({
  key: "authToken",
  default: {
    token: "",
  },
});

export const authRefreshTokenState = atom({
  key: "authRefreshToken",
  default: {
    refreshToken: "",
  },
});

export const authLoginTimeState = atom({
  key: "loginTime",
  default: {
    loginTime: "",
  },
});
