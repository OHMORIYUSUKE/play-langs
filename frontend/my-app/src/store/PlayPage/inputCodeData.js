import { atom } from "recoil";

export const inputCodeDataState = atom({
  key: "inputCodeData",
  default: {
    title: "",
    code_text: "",
    input_text: "",
  },
});
