import { useHistory } from "react-router-dom";

function NotFound() {
  let history = useHistory();
  history.push("/");
  return <></>;
}

export default NotFound;
