import axios from "axios";

function Play() {
  function submit() {
    const inputElementCode = document.getElementById("code");
    const inputValueCode = inputElementCode.value;
    console.log(inputValueCode);

    const inputElementInput = document.getElementById("input");
    const inputValueInput = inputElementInput.value;
    console.log(inputValueInput);

    let element = document.getElementById("lang");
    console.log(element.value);

    axios
      .post(
        "http://localhost:3031/api/v1/play",
        {
          code: inputValueCode,
          input: inputValueInput,
          lang: element.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
        window.alert("投稿が完了しました。");
      })
      .catch((error) => {
        console.log("Error : " + JSON.stringify(error.response));
        window.alert("投稿に失敗しました。");
      });
  }

  return (
    <>
      <h1>Play</h1>
      <select id="lang" name="lang">
        <option value="C">C</option>
        <option value="Go">Go</option>
        <option value="Java">Java</option>
        <option value="Ruby">Ruby</option>
        <option value="JavaScript">JavaScript</option>
        <option value="Haskell">Haskell</option>
      </select>
      <br />
      <textarea id="code" name="code" rows="30" cols="100">
        # code...
      </textarea>
      <textarea id="input" name="input" rows="10" cols="100">
        input...
      </textarea>
      <br />
      <button onClick={submit}>実行</button>
    </>
  );
}

export default Play;
