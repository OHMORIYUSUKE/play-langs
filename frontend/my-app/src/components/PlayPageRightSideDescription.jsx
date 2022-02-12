import * as React from "react";
import { Item } from "./utils/Item";

export default function PlayPageRightSideDescription() {
  return (
    <Item style={{ marginTop: "1rem" }}>
      <h4 style={{ textAlign: "center", margin: "8px" }}>注意事項</h4>
      <p>３秒以内で実行できるコードにしてください。</p>
      <p>※入力されたコードはPython 3.10.0で実行されます。</p>
    </Item>
  );
}
