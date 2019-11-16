import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavigationBar from './helper/nav-bar';
import ProfilePage from './user/profile-page';
import Login from './user/login';

export default function App(props) {
  const [userInfo, setUserInfo] = useState({});

  return (
    <Router>
      <NavigationBar />
      <Switch>
        <Route exact path="/" render={props => userInfo.id ? <ProfilePage {...props}/> : <Login {...props} setUserInfo={setUserInfo} />}/>
      </Switch>
    </Router>
  );
}
