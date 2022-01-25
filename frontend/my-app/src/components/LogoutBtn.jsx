import { getAuth, signOut } from "firebase/auth";
import { app } from "../utils/firebase/firebase";

const clickButton = () => {
  const auth = getAuth(app);
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      alert("サインアウトしました。");
    })
    .catch((error) => {
      // An error happened.
      console.error(error);
    });
};

function FirebaseAuthSignoutButton() {
  return (
    <div>
      <button onClick={clickButton}>ログアウト</button>
    </div>
  );
}

export default FirebaseAuthSignoutButton;
