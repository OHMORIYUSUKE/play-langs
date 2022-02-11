import { atom } from "recoil";

export const inputCodeDataState = atom({
  key: "inputCodeData",
  default: {
    code_text: "",
    input_text: "",
  },
});
