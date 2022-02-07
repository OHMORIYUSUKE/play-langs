import React from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Top from "./Pages/Top";
import NotFound from "./Pages/NotFound";
import Play from "./Pages/Play";
import User from "./Pages/User";
import CustomError from "./Pages/CustomError";

import { RecoilRoot } from "recoil";

function App() {
  const history = useHistory();
  return (
    <RecoilRoot>
      <BrowserRouter history={history}>
        <Switch>
          <Route exact path="/" component={Top} />
          <Route exact path="/play" component={Play} />
          <Route
            exact
            path="/play/:page_param_code_id"
            render={() => <Play />}
          />
          <Route
            exact
            path="/user/:page_param_user_id"
            render={() => <User />}
          />
          <Route
            exact
            path="/error/:customErrorMessage"
            render={() => <CustomError />}
          />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
