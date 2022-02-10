import { atom } from "recoil";

export const snackbarState = atom({
  key: "snackbar",
  default: {
    isOpen: false,
    text: "",
    color: "",
  },
});
