import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route} from 'react-router-dom'
import PageA  from './pages/PageA'
import PageB  from './pages/PageB'
import './myRoute/matchPath'
// import './utils/index.js'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <div>
      <Route path='/a/:b' component={PageA}>
        </Route>
        <Route path='/b' component={PageB}>
        </Route>
      </div>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
