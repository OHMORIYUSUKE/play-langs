import * as React from "react";

import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { editorThemeState } from "../../store/PlayPage/editorTheme";

export default function ThemeBtn() {
  const [editorTheme, setEditorTheme] = useRecoilState(editorThemeState);
  return (
    <>
      <FormControl size="small">
        <Select
          value={editorTheme.isDark === true ? "dark" : "light"}
          onChange={(event) =>
            setEditorTheme({ isDark: event.target.value === "dark" })
          }
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="light">ライト</MenuItem>
          <MenuItem value="dark">ダーク</MenuItem>
        </Select>
        <FormHelperText>エディタのテーマを選択</FormHelperText>
      </FormControl>
    </>
  );
}
