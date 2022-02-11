import { atom } from "recoil";

export const editorThemeState = atom({
  key: "editorTheme",
  default: {
    isDark: true,
  },
});
