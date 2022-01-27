import React from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Top from "./Pages/Top";
import NotFound from "./Pages/NotFound";
import Play from "./Pages/Play";

function App() {
  const history = useHistory();
  return (
    <BrowserRouter history={history}>
      <Switch>
        <Route exact path="/" component={Top} />
        <Route exact path="/play" component={Play} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
