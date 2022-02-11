import { atom } from "recoil";

export const responseResultState = atom({
  key: "responseResult",
  default: {
    isRunning: false,
    exitCode: 0, //正常終了なら0
    out: "",
    error: "",
  },
});
