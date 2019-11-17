import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavigationBar from './helper/nav-bar';
import CreateSurvey from './survey/create-survey';
import ProfilePage from './user/profile-page';
import Login from './user/login';

export default function App(props) {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const localUser = window.localStorage.getItem('userInfo');
    if (localUser) {
      setUserInfo(JSON.parse(localUser));
    }
  }, [userInfo]);

  return (
    <Router>
      <NavigationBar />
      <Switch>
        <Route exact path="/" render={props => userInfo ? <ProfilePage {...props}/> : <Login {...props} setUserInfo={setUserInfo} />}/>
        <Route path="" render={props => <CreateSurvey />} />
      </Switch>
    </Router>
  );
}
