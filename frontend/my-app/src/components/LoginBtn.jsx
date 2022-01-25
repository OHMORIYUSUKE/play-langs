import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../utils/firebase/firebase";

const clickButton = () => {
  const provider = new GoogleAuthProvider();

  const auth = getAuth(app);
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      console.log("Googleアカウントでログインしました。" + token);
    })
    .catch((error) => {
      console.error(error);
    });
};

function FirebaseAuthGoogleButton() {
  return (
    <div>
      <button onClick={clickButton}>Googleアカウントでログイン</button>
    </div>
  );
}

export default FirebaseAuthGoogleButton;
