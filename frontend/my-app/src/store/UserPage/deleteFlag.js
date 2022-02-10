import { atom } from "recoil";

export const deleteFlagState = atom({
  key: "deleteFlag",
  default: {
    isDelete: false,
  },
});
