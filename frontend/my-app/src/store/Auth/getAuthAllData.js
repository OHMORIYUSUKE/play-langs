import {
  authIdState,
  authNameState,
  authPicrureState,
  authTokenState,
  authRefreshTokenState,
  authLoginTimeState,
} from "./authData";

import { selector } from "recoil";

export const getAuthAllData = selector({
  key: "getAuthAllData",
  get: ({ get }) => {
    const idState = get(authIdState);
    const nameState = get(authNameState);
    const pictureState = get(authPicrureState);
    const tokenState = get(authTokenState);
    const refreshTokenState = get(authRefreshTokenState);
    const loginTimeState = get(authLoginTimeState);

    const id = idState.id;
    const name = nameState.name;
    const picture = pictureState.picrure;
    const token = tokenState.token;
    const refreshToken = refreshTokenState.refreshToken;
    const loginTime = loginTimeState.loginTime;
    return { id, name, picture, token, refreshToken, loginTime };
  },
});
