import { atom } from "recoil";

export const responseResultState = atom({
  key: "responseResult",
  default: {
    isRunning: false,
    StatusCode: 0,
    out: "",
    error: "",
  },
});
