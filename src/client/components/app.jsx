import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './user/login';

export default function App(props) {
  return (
    <Router>
      <Switch>
        <Route exact path="/" render={props => <Login {...props} />}/>
      </Switch>
    </Router>
  );
}
