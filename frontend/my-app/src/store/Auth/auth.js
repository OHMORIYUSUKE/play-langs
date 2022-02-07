import { atom } from "recoil";

export const authState = atom({
  key: "user",
  default: {
    // DB情報
    id: "",
    name: "",
    picrure: "",
    // 認証情報
    Token: "",
    login_time: "",
    refreshToken: "",
  },
});
