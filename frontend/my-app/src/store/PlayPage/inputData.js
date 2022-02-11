import { atom } from "recoil";

export const inputCodeDataState = atom({
  key: "inputCodeData",
  default: {
    code: "",
  },
});

export const inputInputDataState = atom({
  key: "inputInputDataState",
  default: {
    input: "",
  },
});

export const inputTitleDataState = atom({
  key: "inputTitleDataState",
  default: {
    title: "",
  },
});

export const inputUserIdDataState = atom({
  key: "inputUserIdDataState",
  default: {
    userId: null,
  },
});
