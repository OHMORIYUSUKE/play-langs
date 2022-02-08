import { atom } from "recoil";

export const SnackbarState = atom({
  key: "Snackbar",
  default: {
    isOpen: false,
    text: "",
    color: "",
  },
});
