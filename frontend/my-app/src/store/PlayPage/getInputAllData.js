import {
  inputCodeDataState,
  inputInputDataState,
  inputTitleDataState,
  inputUserIdDataState,
} from "./inputData";

import { selector } from "recoil";

export const getInputAllData = selector({
  key: "getInputAllData",
  get: ({ get }) => {
    const codeState = get(inputCodeDataState);
    const inputState = get(inputInputDataState);
    const titleState = get(inputTitleDataState);
    const userIdState = get(inputUserIdDataState);

    const title = titleState.title;
    const code = codeState.code;
    const input = inputState.input;
    const useId = userIdState.userId;
    return { code, input, title, useId };
  },
});
