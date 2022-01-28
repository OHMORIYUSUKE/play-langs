import { zeroPadding } from "./zeroPadding";

export const dateTime2Tokyo = (date) => {
  const dt = new Date(date);
  let TokyoTime = dt.setHours(dt.getHours() + 9);
  const D = new Date(date);
  const y = D.getFullYear();
  const month = D.getMonth() + 1;
  const d = D.getDate();
  const h = D.getHours();
  const min = D.getMinutes();

  TokyoTime = `${zeroPadding(y, 4)} ${zeroPadding(month, 2)}/${zeroPadding(
    d,
    2
  )} ${zeroPadding(h, 2)}:${zeroPadding(min, 2)}`;
  return TokyoTime;
};
