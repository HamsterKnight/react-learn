import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
// import { BrowserRouter, Route, Redirect, Switch, Link } from "react-router-dom";
import PageA from "./pages/PageA";
import PageB from "./pages/PageB";
import "./myRoute/matchPath";
// import "./react-router-dom/history";
// import './utils/index.js'
import { BrowserRouter, Route } from "./react-router-dom";
import PageC from "./pages/PageC";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

  <BrowserRouter>
    <div>
      {/* <Link to="/123/a">a</Link>
      <Link to="/b">b</Link>
      <Switch> */}
        <Route path="/a" component={PageA}></Route>
        <Route path="/b" component={PageB}></Route>
        <Route component={PageC}></Route>
        {/* <Redirect to='/b'></Redirect> */}
      {/* </Switch> */}
    </div>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
